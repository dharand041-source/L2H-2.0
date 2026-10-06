from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.domains.careers import router as careers_router
from app.domains.assessments import router as assessments_router
from app.domains.skills import router as skills_router
from app.domains.opportunities import router as opportunities_router

def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Telemetry and Timing Middleware
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-API-Version"] = settings.VERSION
        return response

    # Health Check
    @app.get("/health", tags=["System"])
    async def health_check():
        return {
            "status": "healthy",
            "service": "learn-2-hire-api",
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION
        }

    # Register Domain Routers
    app.include_router(careers_router, prefix=settings.API_V1_PREFIX)
    app.include_router(assessments_router, prefix=settings.API_V1_PREFIX)
    app.include_router(skills_router, prefix=settings.API_V1_PREFIX)
    app.include_router(opportunities_router, prefix=settings.API_V1_PREFIX)

    return app

app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
