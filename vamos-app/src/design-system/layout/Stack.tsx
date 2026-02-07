type Direction = 'vertical' | 'horizontal'
type GridSize = 1 | 2 | 3 | 4 | 5 | 6
type GridGap = 0 | 1 | 2 | 3 | 4 | 6 | 8

type StackProps = {
    direction: Direction
    size: GridSize
    gap: GridGap
    children: React.ReactNode
    framed?: boolean
}



export function Stack(props: StackProps){
    const gridClasses = [
      
    ]

    if(props.framed) gridClasses.push('border-1 border-slate-400')

    const gridStyle = gridClasses.join(' ')
    return <div className={gridStyle}>{props.children}</div>
}