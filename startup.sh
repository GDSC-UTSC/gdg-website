#!/bin/bash

echo "🚀 Starting GDG Website setup..."

echo "📦 Installing Firebase CLI..."
curl -sL https://firebase.tools | bash

echo "📦 Installing npm dependencies..."
npm i

echo "🔧 Creating .env file from .sample.env..."
if [ -f ".sample.env" ]; then
    cp .sample.env .env
    echo "✅ .env created from .sample.env"
else
    echo "❌ .sample.env not found"
    exit 1
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
echo "🎉 Setup complete! Run 'npm run dev' and 'npm run emulators' to start development"
