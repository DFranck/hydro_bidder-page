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
        'h-18 gap-1',
        'flex justify-around',
        'bg-shaded rounded-standard',
        'desktop:gap-3',
        className,
      )}
      {...otherProps}
    >
      {stats.map(([label, value], index) => (
        <div
          key={index}
          className={twJoin(
            'flex items-center',
            'justify-center gap-2',
            'desktop:gap-3',
          )}
        >
          <var
            className={twJoin('important-value text-2xl', 'desktop:text-3xl')}
          >
            {value}
          </var>

          <span
            className={twJoin(
              'label w-min',
              'desktop:text-center',
              'desktop:w-auto',
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
