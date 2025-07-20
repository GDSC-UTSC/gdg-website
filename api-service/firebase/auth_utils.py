from fastapi import Request, HTTPException, status, Depends
from firebase_admin import auth

def get_bearer_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    return auth_header.split("Bearer ", 1)[1]

async def admin_required(request: Request):
    id_token = get_bearer_token(request)
    try:
        decoded_token = auth.verify_id_token(id_token)
        if not decoded_token.get("admin"):
            raise HTTPException(status_code=403, detail="Admin privileges required")
        return decoded_token
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid ID token")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
