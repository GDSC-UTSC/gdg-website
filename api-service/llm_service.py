import google.generativeai as genai
import json
import os
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

def load_system_prompt() -> str:
    """Load the system prompt from the text file."""
    try:
        with open('system_prompt.txt', 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError("system_prompt.txt not found.")

class GeminiService:
    def __init__(self):
        """Initialize Gemini service with API key from environment."""
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        self.system_prompt = load_system_prompt()

    def _validate_response_structure(self, result: Dict[str, Any], expected_application_ids: List[str]) -> bool:
        """Validate the response structure and content."""
        try:
            if 'applications' not in result:
                return False

            applications = result['applications']
            if not isinstance(applications, list):
                return False

            if len(applications) != len(expected_application_ids):
                return False

            received_ids = set()
            for app in applications:
                if not isinstance(app, dict):
                    return False

                if 'application_id' not in app or 'rating' not in app or 'comment' not in app:
                    return False

                app_id = app['application_id']
                if not isinstance(app_id, str) or app_id not in expected_application_ids:
                    return False

                if app_id in received_ids:
                    return False
                received_ids.add(app_id)

                rating = app['rating']
                if not isinstance(rating, int) or rating < 1 or rating > 10:
                    return False

                comment = app['comment']
                if not isinstance(comment, str) or not comment.strip():
                    return False

            return True

        except Exception:
            return False

    async def review_applications(self, job_name: str, job_description: str, applications: List[Dict[str, Any]], tags: list = None) -> List[Dict[str, Any]]:
        """Review multiple applications in a single Gemini call with retry logic."""
        max_retries = 3

        for attempt in range(max_retries):
            try:
                logger.info(f"Starting review attempt {attempt + 1}/{max_retries} for {len(applications)} applications")

                # Format tags for display
                tags_text = ""
                if tags and len(tags) > 0:
                    tags_text = f"\nJob Tags: {', '.join(tags)}"

                # Build applications section
                applications_text = ""
                expected_application_ids = []

                for i, app in enumerate(applications, 1):
                    app_id = app['id']
                    app_info = app['info']
                    expected_application_ids.append(app_id)

                    applications_text += f"""
                    === APPLICATION {i} (ID: {app_id}) ===
                    {app_info}
                    """

                user_prompt = f"""
                Please review these job applications:

                Job Position: {job_name}

                Job Description:
                {job_description}{tags_text}

                Applications to Review:
                {applications_text}

                Please provide ratings for all applications, considering how they compare to each other.
                """

                prompt = f"{self.system_prompt}\n\nUser Input:\n{user_prompt}"
                response = self.model.generate_content(prompt)
                response_text = response.text.strip()

                try:
                    if response_text.startswith('```json'):
                        response_text = response_text[7:]
                    if response_text.startswith('```'):
                        response_text = response_text[3:]
                    if response_text.endswith('```'):
                        response_text = response_text[:-3]

                    result = json.loads(response_text.strip())

                    # Validate the response structure
                    if not self._validate_response_structure(result, expected_application_ids):
                        raise ValueError("Invalid response structure")

                    # Return the applications list
                    logger.info(f"Successfully reviewed {len(result['applications'])} applications on attempt {attempt + 1}")
                    return result['applications']

                except (json.JSONDecodeError, ValueError) as e:
                    if attempt < max_retries - 1:
                        logger.warning(f"Attempt {attempt + 1} failed due to JSON/validation error: {e}")
                        continue
                    else:
                        logger.error(f"All {max_retries} attempts failed due to JSON/validation errors")
                        raise

            except Exception as e:
                if attempt < max_retries - 1:
                    logger.warning(f"Attempt {attempt + 1} failed due to exception: {e}")
                    continue
                else:
                    logger.error(f"All {max_retries} attempts failed due to exceptions")
                    raise
