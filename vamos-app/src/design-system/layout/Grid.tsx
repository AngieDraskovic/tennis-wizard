type Direction = 'vertical' | 'horizontal'
type GridSize = 1 | 2 | 3 | 4 | 5 | 6
type GridGap = 0 | 1 | 2 | 3 | 4 | 6 | 8

type GridProps = {
    direction: Direction
    size: GridSize
    gap: GridGap
    children: React.ReactNode
    framed?: boolean
}

const colsClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
}

const rowsClasses: Record<GridSize, string> = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5',
  6: 'grid-rows-6',
}

const gapClasses: Record<GridGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
}


export function Grid(props: GridProps){
    const directionClass = props.direction === 'vertical' ? colsClasses[props.size] : rowsClasses[props.size]
    const gridClasses = [
        'grid',
        directionClass,
        gapClasses[props.gap],
        'p-4',
        'rounded-md',
        'auto-rows-min'
    ]

    if(props.framed) gridClasses.push('border-1 border-slate-400')

    const gridStyle = gridClasses.join(' ')
    return <div className={gridStyle}>{props.children}</div>
}