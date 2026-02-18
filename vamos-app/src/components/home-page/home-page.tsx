import { useEffect, useState } from "react";
import { getTopPlayers, type TopPlayerRow } from "../../api/players";


export function HomePage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [players, setPlayers] = useState<TopPlayerRow[]>([])

    useEffect(() => {
        async function fetchTopPlayers(){
            try {
                setLoading(true)
                const res = await getTopPlayers()
                setPlayers(res)
            } catch(err) {
                setError('failed to fetch players')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchTopPlayers()
    }, [])

    return (
  <div className='min-h-screen bg-slate-950 text-slate-100'>
    <div className='mx-auto w-full max-w-5xl px-6 py-16'>
      <header className='mb-10'>
        <div className='inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200'>
          <span className='h-2 w-2 rounded-full bg-emerald-400' />
          Tennis Leaderboard
        </div>

        <h1 className='mt-4 text-4xl font-semibold tracking-tight'>
          Top players
        </h1>

        <p className='mt-2 max-w-2xl text-slate-300'>
          Win rate leaderboard (min matches threshold applied). Click a player later to drill down into match history.
        </p>
      </header>

      <section className='rounded-2xl border border-slate-800 bg-slate-900/40 shadow-[0_0_0_1px_rgba(15,23,42,0.4)]'>
        <div className='flex items-center justify-between border-b border-slate-800 px-6 py-4'>
          <div className='flex items-center gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-200'>
              🎾
            </div>
            <div>
              <p className='text-sm text-slate-400'>Leaderboard</p>
              <p className='text-base font-medium'>Top {players.length} players</p>
            </div>
          </div>

          <div className='hidden items-center gap-2 text-sm text-slate-400 sm:flex'>
            <span className='rounded-full border border-slate-700 bg-slate-900 px-3 py-1'>
              Season: all
            </span>
            <span className='rounded-full border border-slate-700 bg-slate-900 px-3 py-1'>
              Surface: all
            </span>
          </div>
        </div>

        {loading && (
          <div className='px-6 py-10'>
            <div className='mb-4 h-4 w-48 animate-pulse rounded bg-slate-800' />
            <div className='space-y-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-12 animate-pulse rounded-xl bg-slate-800/60' />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div className='px-6 py-10'>
            <div className='rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200'>
              <p className='font-medium'>Couldn’t load leaderboard</p>
              <p className='mt-1 text-sm text-rose-200/80'>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className='px-6 py-10'>
            <div className='rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300'>
              No data yet. Run ingest and refresh.
            </div>
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='text-left text-xs uppercase tracking-wider text-slate-400'>
                <tr className='border-b border-slate-800'>
                  <th className='px-6 py-4'>Rank</th>
                  <th className='px-6 py-4'>Player</th>
                  <th className='px-6 py-4 text-right'>Matches</th>
                  <th className='px-6 py-4 text-right'>Wins</th>
                  <th className='px-6 py-4 text-right'>Win rate</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player, idx) => {
                  const winRate = Number(player.percentage_win ?? 0)

                  return (
                    <tr
                      key={player.player_id}
                      className='border-b border-slate-800/70 hover:bg-slate-800/30 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div className='inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-sm'>
                          {idx + 1}
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-200'>
                            {idx < 3 ? '🏆' : '🎾'}
                          </div>
                          <div>
                            <p className='font-medium text-slate-100'>
                              {player.player_name ?? `Player ${player.player_id}`}
                            </p>
                            <p className='text-sm text-slate-400'>
                              ID: {player.player_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4 text-right tabular-nums text-slate-200'>
                        {player.matches_count}
                      </td>

                      <td className='px-6 py-4 text-right tabular-nums text-slate-200'>
                        {player.win_number}
                      </td>

                      <td className='px-6 py-4 text-right'>
                        <span
                          className={[
                            'inline-flex items-center justify-end rounded-full border px-3 py-1 text-sm tabular-nums',
                            winRate >= 70
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                              : winRate >= 55
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                                : 'border-slate-700 bg-slate-900 text-slate-200',
                          ].join(' ')}
                        >
                          {winRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className='mt-10 text-sm text-slate-500'>
        Data source: local SQLite • Built with FastAPI + React
      </footer>
    </div>
  </div>
)

    
}