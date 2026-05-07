from typing import Any


class AppException(Exception):
    """Base exception for all operational (expected) errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Any = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details


class NotFoundError(AppException):
    def __init__(self, resource: str = "Resource", details: Any = None) -> None:
        super().__init__(
            message=f"{resource} not found",
            status_code=404,
            error_code="NOT_FOUND",
            details=details,
        )


class ValidationError(AppException):
    def __init__(self, message: str = "Validation failed", details: Any = None) -> None:
        super().__init__(message=message, status_code=400, error_code="VALIDATION_ERROR", details=details)


class UnauthorizedError(AppException):
    def __init__(self, message: str = "Unauthorized", details: Any = None) -> None:
        super().__init__(message=message, status_code=401, error_code="UNAUTHORIZED", details=details)


class ForbiddenError(AppException):
    def __init__(self, message: str = "Forbidden", details: Any = None) -> None:
        super().__init__(message=message, status_code=403, error_code="FORBIDDEN", details=details)


class ConflictError(AppException):
    def __init__(self, message: str = "Conflict", details: Any = None) -> None:
        super().__init__(message=message, status_code=409, error_code="CONFLICT", details=details)
