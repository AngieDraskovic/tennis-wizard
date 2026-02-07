import type { JSX } from "react"

type ButtonProps = {
    variant: Variant
    children: React.ReactNode
    icon?: JSX.Element
    onClick: () => void
}

type Variant = 'primary' | 'secondary' | 'disabled'

export function Button({
    children,
    variant='primary',
    icon,
    onClick
}: ButtonProps){

    const classes = [
    'border-2',
    'border-lime-800',
    'rounded-md',
    'px-3',
    'py-1',
    'relative',
    ]

    if (icon) {
    classes.push('pl-6')
    }

    const styleBase = classes.join(' ')

    const variantClasses = {
        primary: 'bg-lime-800 hover:bg-lime-700 border-lime-800 text-white cursor-pointer',
        secondary: 'bg-white hover:text-lime-700 text-lime-800 cursor-pointer',
        disabled: 'bg-white text-slate-400 border-slate-400'
    }

    console.log(`${styleBase} ${variantClasses[variant]}`)
    return <button className={`${styleBase} ${variantClasses[variant]}`} 
        onClick={onClick}
    >
        {children}
        {icon &&
         <div className='absolute left-2 top-1/2 -translate-y-1/2'>
            {icon}
        </div>
        }
    </button>
}
