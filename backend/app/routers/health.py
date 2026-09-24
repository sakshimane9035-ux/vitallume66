from fastapi import APIRouter

from app.config import get_settings
from app.db import store

router = APIRouter()


@router.get("/health")
def health():
    settings = get_settings()
    return {
        "status": "healthy",
        "service": "VitalLume Ambient Health Guardian API",
        "version": "2.0.0",
        "environment": settings.environment,
        "database": store.backend_name,
        "framework": "FastAPI",
    }
