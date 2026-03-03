from sqlalchemy import Engine, text

def get_top_players(engine: Engine, min_matches: int, limit: int, season: int | None, surface: str | None ):
    print(min_matches, limit, season)
    query = text("""
    SELECT COUNT(player_id) as matches_count, 
        SUM(is_winner) as win_number,
        ROUND((SUM(is_winner) * 1.0/COUNT(*)) * 100, 2) AS percentage_win,
        player_name,
        player_id
    FROM player_matches 
    WHERE (:season IS NULL OR season = :season) AND (:surface IS NULL OR LOWER(surface) = LOWER(:surface))
    GROUP BY player_id
    HAVING COUNT(player_id) >= :min_matches
    ORDER BY percentage_win DESC
    LIMIT :limit
    """)

    with engine.begin() as conn:
        result = conn.execute(query, {'min_matches' : min_matches, 'limit' : limit, 'season' : season, 'surface' : surface}).mappings().all()

    return result