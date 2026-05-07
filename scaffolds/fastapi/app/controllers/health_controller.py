from fastapi import Request
from fastapi.responses import JSONResponse

from app.models.schemas.common import success_response
from app.services import health_service


async def get_health(request: Request) -> JSONResponse:
    data = await health_service.get_health_status()
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=200,
        content=success_response(
            data=data.model_dump(),
            message="Service is healthy",
            request_id=request_id,
        ),
    )
