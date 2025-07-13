from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import asyncio
import time
from typing import List
from google.api_core import exceptions as google_exceptions

from models import PositionReviewRequest, ReviewResponse, ReviewResult
from llm_service import GeminiService
from firebase import initialize_firebase, FirestoreService

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Job Application Review Service",
    description="A FastAPI service that reviews job applications using LLM",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
try:
    db = initialize_firebase()
    firestore_service = FirestoreService(db)
    gemini_service = GeminiService()
    logger.info("All services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize services: {e}")
    raise

@app.post("/review-applications", response_model=List[ReviewResult])
async def review_applications(request: PositionReviewRequest):
    try:
        logger.info(f"Processing applications for position: {request.position_id}")

        # Validate application_ids if provided
        if request.application_ids is not None:
            if len(request.application_ids) > 10:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot review more than 10 applications at once"
                )
            logger.info(f"Filtering to specific applications: {request.application_ids}")

        # Get position and applications from Firestore
        position, applications = firestore_service.get_position_with_applications(request.position_id)
        logger.info(f"Retrieved position: {position is not None}, applications count: {len(applications) if applications else 0}")

        if not position:
            raise HTTPException(status_code=404, detail="Position not found")

        # Check if position is active
        if position.status != 'active':
            raise HTTPException(
                status_code=400,
                detail=f"Position is not active. Current status: {position.status}. Only active positions can be reviewed."
            )

        if not applications:
            logger.warning(f"No applications found for position {request.position_id}")
            return []

        # Filter applications if specific IDs are provided
        if request.application_ids is not None:
            # Create a set for faster lookup
            requested_ids = set(request.application_ids)
            filtered_applications = [app for app in applications if app.id in requested_ids]

            # Check if all requested applications were found
            found_ids = {app.id for app in filtered_applications}
            missing_ids = requested_ids - found_ids
            if missing_ids:
                logger.warning(f"Some requested applications not found: {missing_ids}")

            applications = filtered_applications
            logger.info(f"Filtered to {len(applications)} applications out of {len(request.application_ids)} requested")

        if not applications:
            raise HTTPException(status_code=400, detail="No valid applications found for review")

        # Convert Firestore data to LLM format (without names)
        llm_data = firestore_service.convert_firestore_to_llm_format(position, applications)
        results = []

        for i, application in enumerate(llm_data['applications']):
            app_id = application['id']

            # Process all questions and extract text from answers
            application_info_parts = []

            for question in application['questions']:
                # Skip file type questions for now
                if question['type'] == 'file':
                    continue

                # For text questions, use the answer directly
                answer_text = question['answer']
                if answer_text.strip():
                    application_info_parts.append(f"{question['label']}: {answer_text}")

            # Consolidate all information
            application_info = "\n\n".join(application_info_parts)

            if not application_info.strip():
                logger.error(f"No valid application info for application {app_id}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Application {app_id} has no valid information for review"
                )

            # Send to LLM for review with job name, description, and tags (without applicant name)
            review = await gemini_service.review_application(
                job_name=llm_data['job_name'],
                job_description=llm_data['job_description'],
                tags=llm_data['tags'],
                application_info=application_info
            )

            results.append(ReviewResult(
                name=app_id,  # Use application ID instead of name
                rating=review['rating'],
                comment=review['comment']
            ))

            logger.info(f"Review completed for application {app_id}: rating={review['rating']}")

            # Save review to Firestore if rating is greater than 0
            if review['rating'] > 0:
                try:
                    review_id = firestore_service.save_application_review(
                        position_id=request.position_id,
                        application_id=app_id,
                        rating=review['rating'],
                        comment=review['comment']
                    )
                    logger.info(f"Review saved: {review_id}")
                except Exception as e:
                    logger.error(f"Failed to save review for application {app_id}: {e}")

        return results

    except HTTPException:
        raise
    except google_exceptions.NotFound as e:
        logger.error(f"Resource not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except google_exceptions.PermissionDenied as e:
        logger.error(f"Permission denied: {e}")
        raise HTTPException(status_code=403, detail="Permission denied")
    except Exception as e:
        logger.error(f"Error processing applications: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Job Application Review Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)
