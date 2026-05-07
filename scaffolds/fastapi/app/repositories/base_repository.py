from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

T = TypeVar("T")


class BaseRepository(ABC, Generic[T]):
    """
    Abstract base repository. Extend this for each entity.

    Swap the implementation with your actual DB client:
      - SQLAlchemy (async): from sqlalchemy.ext.asyncio import AsyncSession
      - DynamoDB: from aiobotocore.session import AioSession
      - MongoDB: motor.motor_asyncio.AsyncIOMotorClient
    """

    @abstractmethod
    async def find_by_id(self, id: Any) -> T | None:
        raise NotImplementedError

    @abstractmethod
    async def find_all(self, filters: dict[str, Any] | None = None) -> list[T]:
        raise NotImplementedError

    @abstractmethod
    async def create(self, data: dict[str, Any]) -> T:
        raise NotImplementedError

    @abstractmethod
    async def update(self, id: Any, data: dict[str, Any]) -> T | None:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, id: Any) -> bool:
        raise NotImplementedError
