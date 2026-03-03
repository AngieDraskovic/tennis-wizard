export function HomePageHeader(){

    return (
    <header className='mb-10'>
        <div className='inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200'>
          <span className='h-2 w-2 rounded-full bg-emerald-400' />
          Tennis Leaderboard
        </div>

        <h1 className='mt-4 text-4xl font-semibold tracking-tight'>
          Top players
        </h1>

        <p className='mt-2 max-w-2xl text-slate-300'>
          Click a player later to drill down into match history.
        </p>
      </header>
    )
}