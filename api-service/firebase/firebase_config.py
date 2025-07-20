import firebase_admin
from firebase_admin import credentials, firestore
import os


def initialize_firebase():
    """Initialize Firebase Admin SDK and return Firestore client."""
    try:
        # --- Configuration for Emulator ---
        # This is the crucial part for connecting to the emulator
        os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080"
        os.environ["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099"
        # ------------------------------------

        # Check if Firebase app is already initialized
        if not firebase_admin._apps:
            # Use service account key file
            service_key_path = os.path.join(os.path.dirname(
                os.path.dirname(__file__)), "serviceKey.json")
            cred = credentials.Certificate(service_key_path)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized with service key file")
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
