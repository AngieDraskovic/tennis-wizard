import type { Player } from "../../../model/Player"

type PlayersTableProps = {
    players: Player[]
}

export function PlayersTable({players}: PlayersTableProps){



    return  <table className='w-full'>
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
                  const winRate = Number(player.winRate ?? 0)

                  return (
                    <tr
                      key={player.playerId}
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
                              {player.name ?? `Player ${player.playerId}`}
                            </p>
                            <p className='text-sm text-slate-400'>
                              ID: {player.playerId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4 text-right tabular-nums text-slate-200'>
                        {player.matches}
                      </td>

                      <td className='px-6 py-4 text-right tabular-nums text-slate-200'>
                        {player.wins}
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
}