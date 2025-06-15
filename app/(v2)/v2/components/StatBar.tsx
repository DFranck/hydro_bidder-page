import { twJoin, twMerge } from 'tailwind-merge'

export function StatBar({
  stats,
  className,
  ...otherProps
}: React.ComponentProps<'div'> & {
  stats: [label: React.ReactNode, value: React.ReactNode][]
}) {
  return (
    <div
      id="stats-bar"
      className={twMerge(
        'h-18',
        'flex justify-around',
        'gap-3',
        'mobile:gap-1',
        'bg-shaded rounded-standard',
        className,
      )}
      {...otherProps}
    >
      {stats.map(([label, value], index) => (
        <div
          key={index}
          className={twJoin(
            'flex items-center',
            'gap-3',
            'mobile:justify-center mobile:gap-2',
          )}
        >
          <var className="important-value mobile:text-2xl text-3xl">
            {value}
          </var>

          <span className="label mobile:w-min mobile:text-left text-center">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
