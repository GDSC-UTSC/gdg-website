# AI Application Review Service

This is the backend API service for reviewing job applications using Google Gemini LLM.

## Setup

1. **Set environment variables**

Create a `.env` file in the `api-service/` directory with the following:

```
GEMINI_API_KEY=
ADMIN_FIREBASE_PROJECT_ID=
ADMIN_FIREBASE_CLIENT_EMAIL=
ADMIN_FIREBASE_PRIVATE_KEY=
```

2. **System Prompt**

Ensure `system_prompt.txt` exists in the `api-service/` directory. This file contains the instructions for the LLM.

3. **Run the API**

```bash
chmod +x run.sh
./run.sh
```

## API Endpoints

### `POST /review-applications`

Review one or more job applications for a position.

**Request Body:**

```json
{
  "position_id": "string",
  "application_ids": ["string", ...] // Optional, review all if omitted
}
```

**Response:**

```json
[
  {
    "name": "application_id",
    "rating": 7,
    "comment": "Strong candidate with relevant experience."
  }
]
```

### `GET /health`

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "service": "Job Application Review Service"
}
```
