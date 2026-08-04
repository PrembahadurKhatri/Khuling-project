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
  const serviceDefs = [
    {
      title: "Construction",
      shortDescription: "General contracting for structures of every scale, run by one site team from groundbreaking through final inspection.",
      description: "We take on the full contracting scope — site mobilization, structural work, MEP coordination, and finishing — under a single accountable site office, so clients aren't managing handoffs between trades.",
      benefits: ["Single point of accountability", "In-house trade coordination", "Documented QA at every phase"],
    },
    {
      title: "Infrastructure",
      shortDescription: "Water, drainage, and utility works engineered to hold up against monsoon loads and decades of public use.",
      description: "From stormwater systems to utility corridors, our infrastructure work is designed for the terrain and traffic it has to survive, not just the day it opens.",
      benefits: ["Terrain-specific engineering", "Government-panel standing", "Monsoon-tested drainage design"],
    },
    {
      title: "Road",
      shortDescription: "Highways and feeder roads built to the load specification, not just the paving schedule.",
      description: "Road construction and rehabilitation, from subgrade compaction through final surfacing, delivered against public-sector tender specifications.",
      benefits: ["Load-tested subgrade work", "Public tender compliance", "Progress reporting by kilometer"],
    },
    {
      title: "Bridge",
      shortDescription: "Span design and heavy structural work carried through from feasibility to load testing.",
      description: "Bridge and structural crossing projects, coordinated across structural engineering, formwork, and load testing, with a government-panel track record on public crossings.",
      benefits: ["Load-tested structural work", "Feasibility-to-handover scope", "Government-panel track record"],
    },
    {
      title: "Building",
      shortDescription: "Structural shell and core work for buildings that need to carry real design loads for decades.",
      description: "Foundation, structural frame, and core work for commercial and institutional buildings, sequenced against the finishing trades that follow.",
      benefits: ["Structural frame expertise", "Sequenced trade handoffs", "Decades-rated materials"],
    },
    {
      title: "Commercial",
      shortDescription: "Office, retail, and mixed-use developments coordinated across structural, MEP, and finishing trades under one project office.",
      description: "Commercial builds run under a single project office covering structural work, MEP, and finishing, so occupancy dates hold even as scope evolves.",
      benefits: ["One project office, all trades", "Occupancy-date discipline", "Mixed-use scheduling experience"],
    },
    {
      title: "Residential",
      shortDescription: "Housing developments built to the same QA process as our public infrastructure work.",
      description: "Residential and housing projects, from individual builds to multi-unit developments, run against the same documented QA process as our government contracts.",
      benefits: ["Same QA process as public work", "Multi-unit scheduling", "Direct client reporting"],
    },
    {
      title: "Consultancy",
      shortDescription: "Feasibility studies, structural review, and engineering advisory for clients planning before they break ground.",
      description: "Independent engineering advisory — feasibility studies, structural review, and cost estimation — for clients who need a second set of eyes before committing to a design.",
      benefits: ["Independent structural review", "Feasibility & cost estimation", "Pre-construction advisory"],
    },
    {
      title: "Project Management",
      shortDescription: "Schedule, budget, and multi-contractor coordination for clients who need one accountable manager, not a committee.",
      description: "We manage schedule, budget, and multi-contractor coordination on behalf of the client, reporting against a fixed baseline rather than a moving target.",
      benefits: ["Baseline schedule reporting", "Multi-contractor coordination", "Budget accountability"],
    },
    {
      title: "Equipment Rental",
      shortDescription: "Sixty-plus pieces of owned heavy equipment available for lease with operator, on and off our own sites.",
      description: "Our in-house fleet — excavators, compactors, and heavy haul equipment — is available for rental with certified operators, reducing schedule risk on projects that need short-notice plant.",
      benefits: ["60+ owned machines", "Certified operators included", "Short-notice availability"],
    },
  ];
  await Service.create(serviceDefs.map((s, idx) => ({ ...s, order: idx })));

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
