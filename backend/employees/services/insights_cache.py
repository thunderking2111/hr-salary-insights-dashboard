from django.core.cache import cache

INSIGHTS_CACHE_VERSION_KEY = "employees:insights:cache_version"
INSIGHTS_CACHE_TIMEOUT = 3600


def insights_cache_key(scope: str) -> str:
    version = cache.get(INSIGHTS_CACHE_VERSION_KEY, 0)
    return f"employees:insights:v{version}:{scope}"


def invalidate_insights_cache() -> None:
    try:
        cache.incr(INSIGHTS_CACHE_VERSION_KEY)
    except ValueError:
        cache.set(INSIGHTS_CACHE_VERSION_KEY, 1, timeout=None)
