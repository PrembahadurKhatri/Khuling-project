// Seeds the database with a working admin user and a handful of demo
// projects/services/testimonials so the site isn't empty on first run.
// Run with: npm run seed

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import Testimonial from "../models/Testimonial.js";
import Settings from "../models/Settings.js";

dotenv.config();

const categories = ["Construction", "Infrastructure", "Road", "Bridge", "Building", "Commercial", "Residential"];
const statuses = ["Completed", "Ongoing", "Upcoming"];
const locations = ["Kathmandu", "Pokhara", "Chitwan", "Biratnagar", "Butwal", "Dharan"];

const run = async () => {
  await connectDB();

  console.log("Clearing existing demo collections...");
  await Promise.all([
    Project.deleteMany({}),
    Service.deleteMany({}),
    Testimonial.deleteMany({}),
  ]);

  const adminEmail = "admin@khilungkalika.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: "ChangeMe123!",
      role: "admin",
    });
    console.log(`Created default admin -> email: ${adminEmail} / password: ChangeMe123!`);
  }

  console.log("Seeding projects...");
  const projects = [];
  for (let i = 1; i <= 30; i++) {
    projects.push({
      title: `Project ${i}: ${categories[i % categories.length]} Development`,
      category: categories[i % categories.length],
      status: statuses[i % statuses.length],
      location: locations[i % locations.length],
      client: `Client Co. ${i}`,
      budget: `NPR ${(i * 2.5).toFixed(1)} Crore`,
      startDate: new Date(2022, i % 12, 1),
      endDate: new Date(2024, i % 12, 1),
      description: `A detailed description of project ${i}, covering scope, engineering approach, and delivery milestones.`,
      shortDescription: `Demo project ${i} for seeding purposes.`,
      thumbnail: "https://placehold.co/800x600?text=Project+" + i,
      gallery: ["https://placehold.co/800x600?text=Gallery+1", "https://placehold.co/800x600?text=Gallery+2"],
      technologiesUsed: ["Reinforced Concrete", "Steel Framing"],
      featured: i <= 6,
      createdBy: admin._id,
    });
  }
  await Project.create(projects);

  console.log("Seeding services...");
  const serviceNames = [
    "Construction", "Infrastructure", "Road", "Bridge", "Building",
    "Commercial", "Residential", "Consultancy", "Project Management", "Equipment Rental",
  ];
  await Service.create(
    serviceNames.map((name, idx) => ({
      title: name,
      shortDescription: `Professional ${name.toLowerCase()} services delivered to enterprise standards.`,
      description: `Full details about our ${name} service offering, methodology, and past performance.`,
      benefits: ["Certified engineers", "On-time delivery", "Transparent reporting"],
      order: idx,
    }))
  );

  console.log("Seeding testimonials...");
  await Testimonial.insertMany(
    Array.from({ length: 12 }).map((_, i) => ({
      name: `Client Name ${i + 1}`,
      designation: "Project Owner",
      company: `Company ${i + 1}`,
      message: "Khilung Kalika Construction delivered our project on time and to an excellent standard.",
      rating: 5,
      featured: i < 4,
    }))
  );

  console.log("Seeding company settings...");
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      stats: { projectsCompleted: 120, yearsExperience: 15, clientsServed: 80, engineers: 45, machines: 60 },
    });
  }

  console.log("Seeding complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
