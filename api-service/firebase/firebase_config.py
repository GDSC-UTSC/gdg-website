import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK and return Firestore client."""
    try:
        # --- Configuration for Emulator ---
        # This is the crucial part for connecting to the emulator
        os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"
        # ------------------------------------

        # Check if Firebase app is already initialized
        if not firebase_admin._apps:
            # Use environment variables for credentials
            cred_dict = {
                "type": "service_account",
                "project_id": os.getenv("ADMIN_FIREBASE_PROJECT_ID"),
                "private_key": os.getenv("ADMIN_FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
                "client_email": os.getenv("ADMIN_FIREBASE_CLIENT_EMAIL"),
                "token_uri": os.getenv("ADMIN_FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token")
            }

            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized with environment variables")
        else:
            print("Firebase Admin SDK already initialized")

        # Get Firestore client
        db = firestore.client()
        print("Firestore client connected to emulator at localhost:8080")

        # positions = db.collection('positions').get()
        # for position in positions:
        #     print(position.id, position.to_dict())

        return db

    except Exception as e:
        print(f"Failed to initialize Firebase: {e}")
        raise

if __name__ == "__main__":
    initialize_firebase()
