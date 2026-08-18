// One-off: sets Settings.mapEmbedUrl directly, same DB access the server
// itself already has — used here because the live admin account's real
// password isn't something this session has access to.
import "dotenv/config";
import mongoose from "mongoose";
import Settings from "../models/Settings.js";

const NEW_MAP_EMBED =
  '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4287.098976128644!2d85.31360889999999!3d27.695148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19fb918be951%3A0x7db479e01f649b!2sKD%20Tower!5e1!3m2!1sen!2snp!4v1787044540624!5m2!1sen!2snp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const settings = await Settings.findOneAndUpdate({}, { mapEmbedUrl: NEW_MAP_EMBED }, { new: true, upsert: true });
  console.log("mapEmbedUrl updated:", settings.mapEmbedUrl);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
