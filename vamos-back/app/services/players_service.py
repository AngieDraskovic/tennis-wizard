from sqlalchemy import Engine, text

def get_top_players(engine: Engine, min_matches: int, limit: int):
    query = text("""
    SELECT COUNT(player_id) as matches_count, SUM(is_winner) as win_number, ROUND((SUM(is_winner) * 1.0/COUNT(*)) * 100, 2) AS percentage_win, player_name 
    FROM player_matches 
    GROUP BY player_id
    HAVING COUNT(player_id) > :min_matches
    ORDER BY percentage_win DESC
    LIMIT :limit
    """)

    with engine.begin() as conn:
        result = conn.execute(query, {'min_matches' : min_matches, 'limit' : limit}).mappings().all()

    return result