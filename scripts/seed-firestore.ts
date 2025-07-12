#!/usr/bin/env tsx

// NOTE IN ORDER TO MAKE AN ACCOIUNT FOR YOURSELF, PLEASE EDIT THE TEMPLATE-DATA.JSON FILE

import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { join } from "path";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkkBylEA-_GbsLuUpNbu1770vCsYlc5Ho",
  authDomain: "gdg-website-314a4.firebaseapp.com",
  projectId: "gdg-website-314a4",
  storageBucket: "gdg-website-314a4.firebasestorage.app",
  messagingSenderId: "765873570971",
  appId: "1:765873570971:web:31d09e516b4dbe9764b23e",
  measurementId: "G-68BM0DGRV6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
try {
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("🔥 Connected to Firestore emulator");
} catch (error) {
  console.log("🔥 Firestore emulator connection already established");
}

// Load template data from JSON file
function loadTemplateData() {
  const templateDataPath = join(__dirname, "template-data.json");
  const templateData = JSON.parse(readFileSync(templateDataPath, "utf-8"));
  return templateData;
}

// Template data functions
function generateTemplateUsers() {
  const templateData = loadTemplateData();
  return templateData.users.map((user: any) => ({
    ...user,
    updatedAt: serverTimestamp(),
  }));
}

function generateTemplateEvents() {
  const templateData = loadTemplateData();
  return templateData.events.map((event: any) => ({
    ...event,
    eventDate: event.eventDate
      ? Timestamp.fromDate(new Date(event.eventDate))
      : undefined,
    registrationDeadline: event.registrationDeadline
      ? Timestamp.fromDate(new Date(event.registrationDeadline))
      : undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
}

function generateTemplatePositions() {
  const templateData = loadTemplateData();
  return templateData.positions.map((position: any) => ({
    ...position,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
}

function generateTemplateProjects() {
  const templateData = loadTemplateData();
  return templateData.projects.map((project: any) => ({
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
}

function generateTemplateApplications() {
  const templateData = loadTemplateData();
  return templateData.applications.map((application: any) => ({
    ...application,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
}

async function createUser(userId: string) {
  console.log(`👤 Creating user with ID: ${userId}...`);

  const newUser = {
    id: userId,
    publicName: `User ${userId}`,
    bio: "New user created via seed command",
    role: "member",
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, "users", userId), newUser);
    console.log(`✅ Created user: ${newUser.publicName} (${userId})`);
  } catch (error) {
    console.error(`❌ Failed to create user ${userId}:`, error);
    throw error;
  }
}

async function seedFirestore(userId?: string) {
  console.log("🌱 Starting Firestore seeding...");

  try {
    // If userId is provided, only create that user
    if (userId) {
      await createUser(userId);
      console.log("🎉 User creation completed successfully!");
      return;
    }

    // Generate and create template users
    console.log("👥 Creating template users...");
    const templateUsers = generateTemplateUsers();
    for (const user of templateUsers) {
      try {
        await setDoc(doc(db, "users", user.id), user);
        console.log(`✅ Created user: ${user.publicName || user.id}`);
      } catch (error) {
        console.log(`⚠️  User ${user.id} might already exist, skipping...`);
      }
    }

    // Generate and create template events
    console.log("📅 Creating template events...");
    const templateEvents = generateTemplateEvents();
    for (const event of templateEvents) {
      try {
        await addDoc(collection(db, "events"), event);
        console.log(`✅ Created event: ${event.title}`);
      } catch (error) {
        console.log(`⚠️  Event ${event.title} creation failed:`, error);
      }
    }

    // Generate and create template positions
    console.log("💼 Creating template positions...");
    const templatePositions = generateTemplatePositions();
    const positionIds: string[] = [];
    for (const position of templatePositions) {
      try {
        const docRef = await addDoc(collection(db, "positions"), position);
        positionIds.push(docRef.id);
        console.log(`✅ Created position: ${position.name}`);
      } catch (error) {
        console.log(`⚠️  Position ${position.name} creation failed:`, error);
      }
    }

    // Generate and create template projects
    console.log("🚀 Creating template projects...");
    const templateProjects = generateTemplateProjects();
    for (const project of templateProjects) {
      try {
        await addDoc(collection(db, "projects"), project);
        console.log(`✅ Created project: ${project.title}`);
      } catch (error) {
        console.log(`⚠️  Project ${project.title} creation failed:`, error);
      }
    }

    // Generate and create template applications for the first position
    if (positionIds.length > 0) {
      console.log("📝 Creating template applications...");
      const templateApplications = generateTemplateApplications();

      for (const application of templateApplications) {
        try {
          await setDoc(
            doc(
              db,
              "positions",
              positionIds[0],
              "applications",
              application.email.split("@")[0]
            ),
            application
          );
          console.log(`✅ Created application from: ${application.name}`);
        } catch (error) {
          console.log(
            `⚠️  Application from ${application.name} creation failed:`,
            error
          );
        }
      }
    }

    console.log("🎉 Firestore seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Users: ${templateUsers.length} template users created`);
    console.log(`- Events: ${templateEvents.length} template events created`);
    console.log(
      `- Positions: ${templatePositions.length} template positions created`
    );
    console.log(
      `- Projects: ${templateProjects.length} template projects created`
    );
    console.log(
      `- Applications: ${
        generateTemplateApplications().length
      } template applications created`
    );
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  // Check if script was called with userId parameter expectation
  const hasUserIdFlag = process.argv.some((arg) => arg.includes("userID"));

  // Get userID from command line arguments
  const userIdArg = process.argv.find((arg) => arg.startsWith("--userID="));
  const userId = userIdArg ? userIdArg.split("=")[1] : undefined;

  // If userId was expected but not provided properly, fail
  if (hasUserIdFlag && !userId) {
    console.error(
      "❌ Error: userID parameter is required when using --userID flag"
    );
    console.error("Usage: npm run seed -- --userID=your-user-id");
    process.exit(1);
  }

  seedFirestore(userId)
    .then(() => {
      console.log("✨ Seeding script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding script failed:", error);
      process.exit(1);
    });
}
