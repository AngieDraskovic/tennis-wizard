from .settings import settings
from .db import engine
from sqlalchemy import text
import pandas as pd
from pathlib import Path


KEEP_COLS = [
    'winner_id', 'winner_name', 'winner_rank', 'tourney_name', 'loser_id', 'loser_name', 'tourney_date'
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
        df['season'] = f.stem.split('_')[-1]  # npr. "2019"

        cols = [c for c in KEEP_COLS if c in df.columns]
        cols.append('season')

        dfs.append(df[cols])

    merged = pd.concat(dfs, ignore_index=True)

    # Minimalno čišćenje (best practice)
    # - osiguraj da su ključne kolone tu
    # - ukloni redove bez winner/loser id (ako ih ima)
    if "winner_id" in merged.columns and "loser_id" in merged.columns:
        merged = merged.dropna(subset=["winner_id", "loser_id"])

    # - tourney_date često dođe kao int (YYYYMMDD), pretvori u string (lakše za SQLite)
    if "tourney_date" in merged.columns:
        merged["tourney_date"] = merged["tourney_date"].astype(str)

    return merged

def write_to_sqlite(df: pd.DataFrame) -> None:
    with engine.begin() as conn:
        df.to_sql("matches_raw", conn, if_exists="replace", index=False)

        # Indeksi za brže upite (nije obavezno, ali je pametno)
        try:
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_date ON matches_raw(tourney_date)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_winner ON matches_raw(winner_id)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_matches_loser ON matches_raw(loser_id)"))
        except Exception:
            # SQLite ponekad ne voli indeks ako kolona ne postoji (zavisno od dataset-a)
            pass

def run() -> None:
    files = find_csv_files()
    df = load_and_concat(files)
    write_to_sqlite(df)
    print(f"✅ Ingest gotov: rows={len(df)} cols={len(df.columns)} -> DB={settings.db_path}")

if __name__ == "__main__":
    run()