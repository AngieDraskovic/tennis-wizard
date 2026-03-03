type FilterChipProps = {
  label: string
  children: React.ReactNode
}

export function FilterChip({ label, children }: FilterChipProps) {
  return (
    <div className='rounded-full border border-slate-700/70 bg-slate-900 px-3 py-1.5'>
      <div className='flex items-center gap-2'>
        <span className='text-xs text-slate-400 whitespace-nowrap'>{label}</span>
        <div className='text-slate-100'>{children}</div>
      </div>
    </div>
  )
}