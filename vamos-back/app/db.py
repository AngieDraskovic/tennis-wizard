from sqlalchemy import create_engine
from .settings import settings

engine = create_engine(
    f"sqlite:///{settings.db_path}",
    future=True
)
