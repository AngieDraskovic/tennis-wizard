from sqlalchemy import Engine, text

def get_seasons(engine: Engine):
    query = text("""
    SELECT DISTINCT season from player_matches
    """)

    with engine.begin() as conn:
        result = conn.execute(query).mappings().all()

    return result