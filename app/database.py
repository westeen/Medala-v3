import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./health.db")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    """
    Create all tables defined on the SQLAlchemy Base metadata.
    """
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
