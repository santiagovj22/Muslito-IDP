from pydantic import BaseModel


class HealthData(BaseModel):
    status: str
    version: str
    uptime: float
    timestamp: str
