from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException
from app.core.logging import get_logger

logger = get_logger(__name__)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    request_id = request.state.request_id if hasattr(request.state, "request_id") else None
    logger.warning(
        "Operational error",
        request_id=request_id,
        error_code=exc.error_code,
        status_code=exc.status_code,
        message=exc.message,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "errorCode": exc.error_code,
            **({"details": exc.details} if exc.details is not None else {}),
            **({"requestId": request_id} if request_id else {}),
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    request_id = request.state.request_id if hasattr(request.state, "request_id") else None
    logger.warning("Request validation failed", request_id=request_id, errors=exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "errorCode": "VALIDATION_ERROR",
            "details": exc.errors(),
            **({"requestId": request_id} if request_id else {}),
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = request.state.request_id if hasattr(request.state, "request_id") else None
    logger.error("Unhandled exception", request_id=request_id, exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred",
            "errorCode": "INTERNAL_ERROR",
            **({"requestId": request_id} if request_id else {}),
        },
    )
