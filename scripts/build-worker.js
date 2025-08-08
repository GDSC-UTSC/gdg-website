#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env" });

const templatePath = path.join(__dirname, "../public/worker.template.js");
const outputPath = path.join(__dirname, "../public/worker.js");

try {
  // Read the template file
  const template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with environment variables
  const workerContent = template
    .replace("{{FIREBASE_API_KEY}}", process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "")
    .replace("{{FIREBASE_AUTH_DOMAIN}}", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "")
    .replace("{{FIREBASE_PROJECT_ID}}", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "")
    .replace("{{FIREBASE_STORAGE_BUCKET}}", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "")
    .replace("{{FIREBASE_MESSAGING_SENDER_ID}}", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "")
    .replace("{{FIREBASE_APP_ID}}", process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "")
    .replace("{{FIREBASE_MEASUREMENT_ID}}", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "");

  // Write the generated worker file
  fs.writeFileSync(outputPath, workerContent);

  console.log("✅ Service worker generated successfully with Firebase credentials");
} catch (error) {
  console.error("❌ Error generating service worker:", error.message);
  process.exit(1);
}
