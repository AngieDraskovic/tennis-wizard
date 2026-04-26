from .settings import settings
from .db import engine
from sqlalchemy import text
import pandas as pd
from pathlib import Path


KEEP_COLS = [
   'tourney_id', 'winner_id', 'winner_name', 'winner_rank', 'tourney_name', 'loser_id', 'loser_name', 'tourney_date', 'surface',
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


def create_player_matches_tb() -> None: 
    query = text("""
    CREATE TABLE player_matches AS
    SELECT tourney_id, winner_id AS player_id, winner_name AS player_name, loser_id AS opponent_id, loser_name AS opponent_name, 1 AS is_winner, season, surface
    FROM matches_raw 
    UNION ALL
    SELECT tourney_id, loser_id AS player_id, loser_name AS player_name, winner_id AS opponent_id, winner_name AS opponent_name, 0 AS is_winner, season, surface
    FROM matches_raw
    """)
    with engine.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS player_matches"))



def run() -> None:
    files = find_csv_files()
    df = load_and_concat(files)
    write_to_sqlite(df)
    print(f"✅ Ingest gotov: rows={len(df)} cols={len(df.columns)} -> DB={settings.db_path}")
    create_player_matches_tb()

if __name__ == "__main__":
    run()