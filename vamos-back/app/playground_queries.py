from sqlalchemy import text
from .db import engine

def execute_query(query):
    with engine.begin() as conn:
        # df = pd.read_sql(query, conn)
        result = conn.execute(query)

    # print(df)
    for row in result:
        print(row)


def  get_player_match_stats(player) -> None:
    query = text("""
        SELECT 
        COUNT(*) FILTER ( WHERE winner_name = :player) as wins,
        COUNT(*) FILTER ( WHERE loser_name = :player) as losses,
        COUNT(*) FILTER ( WHERE winner_name = :player OR loser_name = :player) as total
        FROM matches_raw
        """)

    with engine.begin() as conn:
        result = conn.execute(query, {'player' : player}).one()

    print(f'row count: {result.total} {result.wins} {result.losses}')

def count_matches_per_player() -> None:
    query = text("""
    SELECT COUNT(player_id) as matches_count, player_name 
    FROM player_matches 
    GROUP BY player_id 
    ORDER BY matches_count 
    """)
    
    execute_query(query)



def find_all_surfaces() -> None:
    query = text("""
    SELECT COUNT(*), surface FROM player_matches group by surface
    """)

    execute_query(query)


def top_ten_players() -> None:
    query = text("""
    SELECT 
        COUNT(player_id) as matches_count,
        SUM(is_winner) as win_number,
        ROUND((SUM(is_winner) * 1.0/COUNT(*)) * 100, 2) AS percentage_win,
        player_name 
    FROM player_matches 
    GROUP BY player_id
    HAVING matches_count > 50
    ORDER BY percentage_win DESC
    LIMIT 10
    """)

    execute_query(query)


def find_all_surfaces() -> None:
    query = text("""
    SELECT COUNT(*), surface FROM player_matches group by surface
    """)

    execute_query(query)

if __name__ == "__main__":
    top_ten_players()