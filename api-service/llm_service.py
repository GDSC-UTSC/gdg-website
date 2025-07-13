import google.generativeai as genai
import json
import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

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

    async def review_application(self, job_name: str, job_description: str, application_info: str, tags: list = None) -> Dict[str, Any]:
        try:
            # Format tags for display
            tags_text = ""
            if tags and len(tags) > 0:
                tags_text = f"\nJob Tags: {', '.join(tags)}"

            user_prompt = f"""
            Please review this job application:

            Job Position: {job_name}

            Job Description:
            {job_description}

            Job Tags:
            {tags_text}

            Application Information:
            {application_info}
            """

            # Create the prompt then send to Gemini
            prompt = f"{self.system_prompt}\n\nUser Input:\n{user_prompt}"
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Try to extract JSON from the response
            try:
                # Remove any markdown code block formatting if present
                if response_text.startswith('```json'):
                    response_text = response_text[7:]
                if response_text.startswith('```'):
                    response_text = response_text[3:]
                if response_text.endswith('```'):
                    response_text = response_text[:-3]

                result = json.loads(response_text.strip())

                # Validate the response structure
                if 'rating' not in result or 'comment' not in result:
                    raise ValueError("Invalid response structure")

                # Ensure rating is within valid range
                rating = int(result['rating'])
                if rating < 1 or rating > 10:
                    raise ValueError("Rating must be between 1 and 10")

                return {
                    'rating': rating,
                    'comment': str(result['comment'])
                }

            except (json.JSONDecodeError, ValueError) as e:
                return {
                    'rating': 0,
                    'comment': "Unable to process application review due to formatting error."
                }

        except Exception as e:
            return {
                'rating': 0,
                'comment': "Error occurred during application review."
            }
