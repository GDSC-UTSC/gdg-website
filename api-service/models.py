from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Any

# API Request/Response Models
class PositionReviewRequest(BaseModel):
    position_id: str
    application_ids: Optional[List[str]] = Field(default=None, description="List of specific application IDs to review. If not provided, all applications will be reviewed.")

    class Config:
        alias_generator = lambda string: string.replace('_', '') if string == 'position_id' else string
        populate_by_name = True

class ReviewResult(BaseModel):
    name: str
    rating: int
    comment: str

class ReviewResponse(BaseModel):
    results: List[ReviewResult]

# Firestore Data Models with Validation
class Position(BaseModel):
    id: str
    name: str = Field(..., min_length=1, description="Position name cannot be empty")
    description: str = Field(..., min_length=1, description="Position description cannot be empty")
    tags: List[str] = Field(default_factory=list)
    status: str = Field(..., description="Position status")
    questions: List[Dict] = Field(default_factory=list)
    created_at: Optional[Any] = None
    updated_at: Optional[Any] = None

    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['draft', 'active', 'closed']
        if v not in valid_statuses:
            raise ValueError(f"Invalid status: {v}. Must be one of {valid_statuses}")
        return v

    @validator('name', 'description')
    def validate_non_empty_strings(cls, v):
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

class Application(BaseModel):
    id: str
    name: str = Field(..., min_length=1, description="Application name cannot be empty")
    email: str = Field(..., description="Application email")
    questions: Dict[str, str] = Field(..., description="Application questions and answers")
    status: str = Field(default="pending", description="Application status")
    created_at: Optional[Any] = None
    updated_at: Optional[Any] = None

    @validator('name', 'email')
    def validate_non_empty_strings(cls, v):
        if not v or not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

    @validator('questions')
    def validate_questions(cls, v):
        if not v or not isinstance(v, dict):
            raise ValueError("Application questions must be a non-empty dictionary")
        return v

    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['pending', 'accepted', 'rejected', 'reviewed']
        if v not in valid_statuses:
            raise ValueError(f"Invalid status: {v}. Must be one of {valid_statuses}")
        return v
