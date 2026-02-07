from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_path: str = 'tennis.db'
    csv_dir: str = 'data'

    class Config:
        env_file = '.env'

settings = Settings()
