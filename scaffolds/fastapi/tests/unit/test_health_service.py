import pytest

from app.services.health_service import get_health_status


@pytest.mark.asyncio
async def test_get_health_status_returns_healthy():
    result = await get_health_status()
    assert result.status == "healthy"


@pytest.mark.asyncio
async def test_get_health_status_has_version():
    result = await get_health_status()
    assert isinstance(result.version, str)
    assert len(result.version) > 0


@pytest.mark.asyncio
async def test_get_health_status_uptime_non_negative():
    result = await get_health_status()
    assert result.uptime >= 0


@pytest.mark.asyncio
async def test_get_health_status_timestamp_is_iso():
    from datetime import datetime
    result = await get_health_status()
    # Should not raise
    datetime.fromisoformat(result.timestamp)
