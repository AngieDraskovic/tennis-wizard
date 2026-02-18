from fastapi import APIRouter
from app.db import engine
from app.services.players_service import get_top_players

router = APIRouter(prefix="/players", tags=["players"])

@router.get('/top')
def top_players(min_matches: int = 50, limit: int = 10):
    return get_top_players(engine, min_matches, limit)
  