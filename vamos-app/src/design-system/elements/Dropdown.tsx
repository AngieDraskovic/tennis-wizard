import { type ChangeEvent } from "react"

type DropdownProps = {
    options: Option[]
    label?: string
    hideLabel?: boolean    
    value: string
    onChange: (value: string) => void
    className?: string
}


type Option = {
    value: string
    label: string
}

export function Dropdown({options, label, value, className, hideLabel, onChange}: DropdownProps){
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value)
    }

   return (
    <label className='flex items-center gap-2 text-sm text-slate-300 max-w-fit'>
      {!hideLabel && label && (
        <span className='whitespace-nowrap text-slate-400'>
          {label}:
        </span>
      )}

      <select
        name={label}
        value={value}
        onChange={handleChange}
         className={[
          'h-8 rounded-md border border-slate-700 bg-slate-950/60 px-2 text-slate-100 outline-none transition',
          'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500',
          className ?? ''
        ].join(' ')}
      >
        {options.map((opt, i) => (
          <option key={opt.value ?? i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}