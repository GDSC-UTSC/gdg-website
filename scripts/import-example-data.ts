import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase config (using emulator)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "gdg-website-314a4",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Connect to emulator
connectFirestoreEmulator(db, 'localhost', 8080);

async function importData() {
  try {
    // Read the example data
    const dataPath = path.join(__dirname, '..', 'example-registration-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log('🚀 Starting data import...');

    // Import users
    console.log('📝 Importing users...');
    for (const user of data.users) {
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        updatedAt: serverTimestamp()
      });
      console.log(`✅ User imported: ${user.publicName}`);
    }

    // Import events
    console.log('📅 Importing events...');
    for (const event of data.events) {
      const eventData = {
        ...event,
        eventDate: new Date(event.eventDate),
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      delete eventData.id; // Remove id from data
      
      await setDoc(doc(db, 'events', event.id), eventData);
      console.log(`✅ Event imported: ${event.title}`);
    }

    // Import event registrations
    console.log('📋 Importing event registrations...');
    for (const registration of data.event_registrations) {
      const registrationData = {
        ...registration,
        registrationDate: new Date(registration.registrationDate)
      };
      delete registrationData.id; // Remove id from data
      
      await setDoc(doc(db, 'event_registrations', registration.id), registrationData);
      console.log(`✅ Registration imported: ${registration.id}`);
    }

    console.log('🎉 All data imported successfully!');
    console.log('📊 Summary:');
    console.log(`   Users: ${data.users.length}`);
    console.log(`   Events: ${data.events.length}`);
    console.log(`   Registrations: ${data.event_registrations.length}`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
  }
}

// Run the import
importData();