from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "OK"
    data: T
    meta: dict[str, Any] | None = None
    request_id: str | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str = "ERROR"
    details: Any = None
    request_id: str | None = None


def success_response(
    data: T,
    message: str = "OK",
    meta: dict[str, Any] | None = None,
    request_id: str | None = None,
) -> dict[str, Any]:
    return {
        "success": True,
        "message": message,
        "data": data,
        **({"meta": meta} if meta is not None else {}),
        **({"requestId": request_id} if request_id else {}),
    }
