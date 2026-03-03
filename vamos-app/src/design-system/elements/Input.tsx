import { type ChangeEvent, type HTMLInputTypeAttribute } from "react"

type InputProps = {
    label?: string
    hideLabel?: boolean
    className?: string
    value: string | number
    type?: HTMLInputTypeAttribute
    onChange: (value: string) => void
}

export function Input({value, onChange, type, label, className, hideLabel}: InputProps){
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    return  <label className='flex items-center gap-2 text-sm text-slate-300'>
      {!hideLabel && label && <span className='whitespace-nowrap text-slate-400'>{label}:</span>}

      <input
        name={label}
        value={value}
        onChange={handleChange}
        type={type}
         className={[
          'h-8 w-16 rounded-md border border-slate-700 bg-slate-950/60 px-2 text-slate-100 outline-none transition',
          'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500',
          className ?? ''
        ].join(' ')}
      />
    </label>
}
