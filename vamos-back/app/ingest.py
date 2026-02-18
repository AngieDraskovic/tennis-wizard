from .settings import settings
from .db import engine
from sqlalchemy import text
import pandas as pd
from pathlib import Path
import os


KEEP_COLS = [
   'tourney_id', 'winner_id', 'winner_name', 'winner_rank', 'tourney_name', 'loser_id', 'loser_name', 'tourney_date',
]

def find_csv_files() -> list[Path]:
    data_dir = Path(settings.csv_dir)
    files = sorted(data_dir.glob('atp_matches_*.csv'))
    if not files:
        raise FileNotFoundError(
            f'{data_dir.resolve()} expected atp_matches_*.csv'
        )
    return files


def load_and_concat(files: list[Path]) -> pd.DataFrame:
    dfs = []
    for f in files:
        df = pd.read_csv(f)
        df['season'] = f.stem.split('_')[-1]  # stem removes the file extension, new colon names season

        cols = [c for c in KEEP_COLS if c in df.columns]
        cols.append('season')

        dfs.append(df[cols])

    merged = pd.concat(dfs, ignore_index=True)

    if "winner_id" in merged.columns and "loser_id" in merged.columns:
        merged = merged.dropna(subset=["winner_id", "loser_id"]) # drop rows that have NaN for either winner id/loser id

    if "tourney_date" in merged.columns:
        merged["tourney_date"] = merged["tourney_date"].astype(str)

    return merged

def write_to_sqlite(df: pd.DataFrame) -> None:
    with engine.begin() as conn:
        df.to_sql("matches_raw", conn, if_exists="replace", index=False)

        # Indexes for quicker queries
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_date ON matches_raw(tourney_date)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches_raw(winner_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_loser ON matches_raw(loser_id)"))
        except Exception:
            # in case colon does not exist 
            pass



def check_number(player) -> None:
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


def create_player_matches_tb() -> None: 
    query = text("""
    CREATE TABLE player_matches AS
    SELECT tourney_id, winner_id AS player_id, winner_name AS player_name, loser_id AS opponent_id, loser_name AS opponent_name, 1 AS is_winner
    FROM matches_raw 
    UNION ALL
    SELECT tourney_id, loser_id AS player_id, loser_name AS player_name, winner_id AS opponent_id, winner_name AS opponent_name, 0 AS is_winner
    FROM matches_raw
    """)
    with engine.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS player_matches"))
        result = conn.execute(query)

    print('')

def count_matches_per_player() -> None:
    query = text("""
    SELECT COUNT(player_id) as matches_count, player_name 
    FROM player_matches 
    GROUP BY player_id 
    ORDER BY matches_count 
    """)
    
    execute_query(query)


def win_percentage() -> None:
    query = text("""

    SELECT COUNT(player_id) as matches_count, SUM(is_winner) as win_number, ROUND((SUM(is_winner) * 1.0/COUNT(*)) * 100, 2) AS percentage_win, player_name 
    FROM player_matches 
    GROUP BY player_id 
    ORDER BY percentage_win
    """)

    execute_query(query)


def execute_query(query):
    with engine.begin() as conn:
        # df = pd.read_sql(query, conn)
        result = conn.execute(query)

    # print(df)
    for row in result:
        print(row)


def top_ten_players() -> None:
    query = text("""
    SELECT COUNT(player_id) as matches_count, SUM(is_winner) as win_number, ROUND((SUM(is_winner) * 1.0/COUNT(*)) * 100, 2) AS percentage_win, player_name 
    FROM player_matches 
    GROUP BY player_id
    HAVING matches_count > 50
    ORDER BY percentage_win DESC
    LIMIT 20
    """)

    execute_query(query)


def run() -> None:
    files = find_csv_files()
    df = load_and_concat(files)
    write_to_sqlite(df)
    # check_number('Novak Djokovic')
    print(f"✅ Ingest gotov: rows={len(df)} cols={len(df.columns)} -> DB={settings.db_path}")
    create_player_matches_tb()
    top_ten_players()

if __name__ == "__main__":
    run()