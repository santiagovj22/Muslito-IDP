from fastapi import APIRouter, Request

from app.controllers import health_controller

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check")
async def health_check(request: Request):
    return await health_controller.get_health(request)
