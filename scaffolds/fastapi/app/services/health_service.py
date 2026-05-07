import time
from datetime import datetime, timezone

from app.core.config import get_settings
from app.models.schemas.health import HealthData

_start_time = time.time()


async def get_health_status() -> HealthData:
    settings = get_settings()
    return HealthData(
        status="healthy",
        version=settings.SERVICE_VERSION,
        uptime=round(time.time() - _start_time, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
        # Add dependency checks as your service grows:
        # dependencies={"database": await check_db(), "cache": await check_cache()},
    )
