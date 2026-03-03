from fastapi import APIRouter
from app.db import engine
from app.services.matches_service import get_seasons

router = APIRouter(prefix="/matches", tags=["matches"])

@router.get('/seasons')
def top_players():
    return {'seasons' : get_seasons(engine)}
  