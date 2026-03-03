import { useEffect, useState } from "react";
import { getTopPlayers } from "../../api/players";
import type { Player } from "../../model/Player";
import { PlayersTable } from "../../design-system/elements/players/PlayersTable";
import { getSeasons } from "../../api/matches";
import { Dropdown } from "../../design-system/elements/Dropdown";
import { SURFACES } from "../../model/Match";
import { Input } from "../../design-system/elements/Input";
import { HomePageHeader } from "./home-page-header";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export function HomePage() {
    const [loading, setLoading] = useState(false)
    const [seasonsLoading, setSeasonsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [players, setPlayers] = useState<Player[]>([])
    const [seasons, setSeasons] = useState<{label: string, value: string}[]>([])
    const [selectedSeason, setSelectedSeason] = useState<string>('')
    const [selectedSurface, setSelectedSurface] = useState<string>('')
    const [selectedLimit, setSelectedLimit] = useState<string>('10')
    const [minMatches, setMinMatches] = useState<number>(10)
    const debouncedMinMatches = useDebouncedValue(minMatches, 400)


    const limitOptions = ['10', '20', '50', '100']
    useEffect(() => {
      fetchSeasons()
    }, [])

    useEffect(() => {
        fetchTopPlayers(selectedLimit, selectedSeason, selectedSurface, debouncedMinMatches)
    }, [selectedLimit, selectedSeason, selectedSurface, debouncedMinMatches])

    async function fetchTopPlayers(limit: string, season: string, surface: string, minMatches: number){
      try {
          setLoading(true)
          const res = await getTopPlayers({limit, season, surface, minMatches})
          setPlayers(res)
      } catch(err) {
          setError('failed to fetch players')
          console.error(err)
      } finally {
          setLoading(false)
      }
    }

    async function fetchSeasons(){
      try {
          setSeasonsLoading(true)
          const res = await getSeasons()
          setSeasons(res.seasons.map(s => ({label: s.season, value: s.season})))
      } catch(err) {
          setError('failed to fetch season')
          console.error(err)
      } finally {
          setSeasonsLoading(false)
      }
    }

    const addAllOption = (array: {label:string, value: string}[]) => {
      return [...array, {label: 'All', value: ''}]
    }

    return (
  <div className='min-h-screen bg-slate-950 text-slate-100'>
    <div className='mx-auto w-full max-w-5xl px-6 py-16'>
      <HomePageHeader/>
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
              <Input  
                label={'min matches'}
                value={minMatches}
                onChange={(value) => setMinMatches(Math.max(0, (Number(value)|| 0)))}/> 
            </span>
          <span className='rounded-full border border-slate-700 bg-slate-900 px-3 py-1'>
              {!seasonsLoading && 
              <Dropdown 
                label='seasons' 
                options={addAllOption(seasons)}
                value={selectedSeason} 
                onChange={(value) => setSelectedSeason(value)}/>
              }
            </span>
            <span className='rounded-full border border-slate-700 bg-slate-900 px-3 py-1'>
              <Dropdown 
              label='surface'
              value={selectedSurface}
              options={addAllOption(SURFACES.map(s => ({label: s, value:s})))}
              onChange={(value) => setSelectedSurface(value)}/>              
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
        <div className='space-y-3'>
          <div className='overflow-x-auto'>
            <PlayersTable players={players} />
          </div>

          <div className='flex justify-end'>
            <div className='pb-3 mr-6'>
              <Dropdown
                options={limitOptions.map(opt => ({ label: opt, value: opt }))}
                value={selectedLimit}
                onChange={value => setSelectedLimit(value)}
              />
            </div>
          </div>
        </div>
      )}
      </section>
    </div>
  </div>
)

    
}