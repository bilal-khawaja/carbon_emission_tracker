from fastapi import FastAPI, status
from sqlmodel import SQLModel
from database import engine, get_session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from api.settings_api import app as settings_router
from api.auth_api import router as auth_router
from api.data_api import router as data_router
from api.methods import set_emission_factors

from dotenv import load_dotenv
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4300", "http://localhost:5175", "https://superior-carbon-footprint-tracker.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = [err['msg'] for err in exc.errors()] 
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"message": ", ".join(errors)},
    )
    
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(settings_router, prefix="/settings", tags=["Settings"])
app.include_router(data_router, prefix="/data", tags=["Data"])


@app.on_event("startup")
def on_startup() -> None:
    SQLModel.metadata.create_all(engine)
    with next(get_session()) as session:
        set_emission_factors(session)

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)