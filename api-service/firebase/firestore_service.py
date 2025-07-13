import logging
from typing import List, Dict, Optional, Tuple
from firebase_admin import firestore
from pydantic import ValidationError
from models import Position, Application

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class FirestoreService:
    """Service class for Firestore operations."""

    def __init__(self, db: firestore.Client):
        self.db = db

    def get_position_with_applications(self, position_id: str) -> tuple[Optional[Position], List[Application]]:
        """Get a position and all its applications."""
        try:
            # Get position
            position = self._get_position(position_id)
            if not position:
                return None, []

            # Get applications
            applications = self._get_applications(position_id)
            return position, applications

        except Exception as e:
            logger.error(f"Error fetching position and applications for {position_id}: {e}")
            raise

    def _get_position(self, position_id: str) -> Optional[Position]:
        """Get a position by ID from Firestore."""
        try:
            if not position_id or not self.db:
                return None

            doc_ref = self.db.collection('positions').document(position_id)
            doc = doc_ref.get()

            if doc.exists:
                data = doc.to_dict()
                data['id'] = doc.id
                return Position(**data)
            else:
                return None

        except ValidationError as e:
            logger.error(f"Position {position_id} validation failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Error fetching position {position_id}: {e}")
            raise

    def _get_applications(self, position_id: str) -> List[Application]:
        """Get all applications for a position from Firestore."""
        try:
            if not position_id or not self.db:
                return []

            applications_ref = self.db.collection('positions').document(position_id).collection('applications')
            docs = applications_ref.stream()

            applications = []
            for doc in docs:
                try:
                    data = doc.to_dict()
                    data['id'] = doc.id
                    applications.append(Application(**data))
                except ValidationError as e:
                    logger.warning(f"Application {doc.id} validation failed: {e}")
                    continue

            return applications

        except Exception as e:
            logger.error(f"Error fetching applications for position {position_id}: {e}")
            raise

    def convert_firestore_to_llm_format(self, position: Position, applications: List[Application]) -> Dict:
        """Convert Firestore data to the format expected by the LLM service."""
        try:
            llm_applications = []

            for app in applications:
                questions = []

                for i, position_question in enumerate(position.questions):
                    question_label = position_question.get('label', f'Question {i+1}')
                    position_question_type = position_question.get('type', 'text')

                    # Skip file questions for now
                    if position_question_type == 'file':
                        continue

                    answer = app.questions.get(question_label, '')

                    questions.append({
                        'label': question_label,
                        'answer': answer,
                        'type': position_question_type
                    })
                llm_applications.append({
                    'id': app.id,
                    'questions': questions
                })

            return {
                'job_name': position.name,
                'job_description': position.description,
                'tags': position.tags,
                'applications': llm_applications
            }

        except Exception as e:
            logger.error(f"Error converting Firestore data to LLM format: {e}")
            raise

    def save_application_review(self, position_id: str, application_id: str, rating: int, comment: str) -> str:
        """Save a review to the reviews subcollection of a position. Replace existing review if it exists."""
        try:
            if not position_id or not application_id or not self.db:
                raise ValueError("Invalid input parameters")

            # Check if position exists and is active
            position = self._get_position(position_id)
            if not position:
                raise ValueError(f"Position with ID {position_id} not found")

            if position.status != 'active':
                raise ValueError(f"Position {position_id} is not active")

            # Create review document
            review_data = {
                'rating': rating,
                'comment': comment,
                'applicationId': application_id,
                'createdAt': firestore.SERVER_TIMESTAMP
            }

            # Check if a review already exists for this application
            reviews_ref = self.db.collection('positions').document(position_id).collection('reviews')
            from google.cloud.firestore_v1.base_query import FieldFilter
            existing_reviews = reviews_ref.where(
                filter=FieldFilter("applicationId", "==", application_id)
            ).get()

            existing_review_doc = None
            for doc in existing_reviews:
                existing_review_doc = doc
                break

            if existing_review_doc:
                existing_review_doc.reference.update(review_data)
                return existing_review_doc.id
            else:
                doc_ref = reviews_ref.add(review_data)[1]
                return doc_ref.id

        except Exception as e:
            logger.error(f"Error saving review for application {application_id}: {e}")
            raise
