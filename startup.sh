#!/bin/bash

echo "🚀 Starting GDG Website setup..."

echo "📦 Installing Firebase CLI..."
curl -sL https://firebase.tools | bash

echo "📦 Installing npm dependencies..."
npm i

echo "🔧 Checking .env file..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📋 Please create a .env file with your Firebase credentials before running this script."
    echo "💡 You can copy .sample.env as a template: cp .sample.env .env"
    exit 1
else
    echo "✅ .env file found"
fi

echo "🔥 Creating Firebase rules files..."

cat > firestore.rules << 'EOF'
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
EOF

cat > storage.rules << 'EOF'
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
EOF

echo "✅ Firebase rules created (firestore.rules & storage.rules)"

echo "⚠️  Before building the worker, please ensure you have configured your .env file with your Firebase credentials."
echo "📝 Have you updated your .env file with your Firebase project settings? (y/n)"
read -r env_configured

if [ "$env_configured" = "y" ] || [ "$env_configured" = "Y" ]; then
    echo "🔧 Building worker..."
    npm run build:worker
else
    echo "❌ Please update your .env file with your Firebase credentials before running 'npm run build:worker'"
    echo "📋 Required environment variables:"
    echo "   NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "   NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
    echo ""
    echo "🔧 You can run 'npm run build:worker' manually after updating your .env file"
fi

echo "🎉 Setup complete! Run 'npm run dev' to start development"
