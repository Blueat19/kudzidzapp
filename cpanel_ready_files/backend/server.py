# ===========================================
# FastAPI Backend Server for Tanga Kudzidza
# ===========================================
# Developer: SCW Digital | +263 78 709 0543
# ===========================================

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = "tangakudzidza"

# Global database client
db_client: Optional[AsyncIOMotorClient] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage database connection lifecycle"""
    global db_client
    try:
        db_client = AsyncIOMotorClient(MONGO_URL)
        # Test connection
        await db_client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        db_client = None
    
    yield
    
    if db_client:
        db_client.close()
        print("MongoDB connection closed.")


# Create FastAPI app
app = FastAPI(
    title="Tanga Kudzidza API",
    description="Backend API for Tanga Kudzidza Learning App",
    version="1.0.0",
    lifespan=lifespan
)

# Get allowed origins from environment
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_str == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_database():
    """Get database instance"""
    if db_client:
        return db_client[DATABASE_NAME]
    return None


# ===========================================
# PYDANTIC MODELS
# ===========================================

class ProgressData(BaseModel):
    user_id: str
    stars: int = 0
    level: int = 1
    letters_completed: List[str] = []
    words_completed: List[str] = []
    math_completed: List[int] = []
    tracing_completed: List[str] = []
    language: str = "both"
    updated_at: Optional[datetime] = None


class ProgressUpdate(BaseModel):
    stars: Optional[int] = None
    level: Optional[int] = None
    letters_completed: Optional[List[str]] = None
    words_completed: Optional[List[str]] = None
    math_completed: Optional[List[int]] = None
    tracing_completed: Optional[List[str]] = None
    language: Optional[str] = None


# ===========================================
# API ENDPOINTS
# ===========================================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": "Tanga Kudzidza API",
        "version": "1.0.0",
        "developer": "SCW Digital",
        "contact": "+263 78 709 0543",
        "status": "running"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    db = get_database()
    db_status = "connected" if db is not None else "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/api/progress/{user_id}")
async def get_progress(user_id: str):
    """Get user progress"""
    db = get_database()
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    progress = await db.progress.find_one({"user_id": user_id})
    
    if progress:
        progress["_id"] = str(progress["_id"])
        return progress
    
    # Return default progress if not found
    return {
        "user_id": user_id,
        "stars": 0,
        "level": 1,
        "letters_completed": [],
        "words_completed": [],
        "math_completed": [],
        "tracing_completed": [],
        "language": "both"
    }


@app.post("/api/progress/{user_id}")
async def save_progress(user_id: str, progress: ProgressUpdate):
    """Save or update user progress"""
    db = get_database()
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    update_data = {k: v for k, v in progress.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.progress.update_one(
        {"user_id": user_id},
        {"$set": update_data},
        upsert=True
    )
    
    return {
        "success": True,
        "user_id": user_id,
        "modified": result.modified_count > 0,
        "message": "Progress saved successfully"
    }


@app.delete("/api/progress/{user_id}")
async def reset_progress(user_id: str):
    """Reset user progress"""
    db = get_database()
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    await db.progress.delete_one({"user_id": user_id})
    
    return {
        "success": True,
        "user_id": user_id,
        "message": "Progress reset successfully"
    }


@app.get("/api/stats")
async def get_stats():
    """Get overall app statistics"""
    db = get_database()
    if not db:
        raise HTTPException(status_code=503, detail="Database not available")
    
    total_users = await db.progress.count_documents({})
    
    # Aggregate statistics
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_stars": {"$sum": "$stars"},
                "avg_level": {"$avg": "$level"},
                "max_level": {"$max": "$level"}
            }
        }
    ]
    
    stats_cursor = db.progress.aggregate(pipeline)
    stats_list = await stats_cursor.to_list(length=1)
    
    if stats_list:
        stats = stats_list[0]
        return {
            "total_users": total_users,
            "total_stars": stats.get("total_stars", 0),
            "average_level": round(stats.get("avg_level", 1), 2),
            "max_level": stats.get("max_level", 1)
        }
    
    return {
        "total_users": 0,
        "total_stars": 0,
        "average_level": 1,
        "max_level": 1
    }


# ===========================================
# RUN SERVER (for local development)
# ===========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
