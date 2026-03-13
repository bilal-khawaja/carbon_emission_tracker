from typing import Any, Generator
from sqlmodel import create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()

database_url = os.getenv("DATABASE_URL")    
 
if DATABASE_URL and "sqlite" in DATABASE_URL:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

def get_session() -> Generator[Session, Any, None]:
    with Session(engine) as session:
        yield session