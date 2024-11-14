import { twJoin } from "tailwind-merge"

export const classNames = {
  percentageOfNonVoters: twJoin(`
    flex
    items-center
    justify-center
    gap-2
    whitespace-nowrap
    rounded-md
    bg-palette-blue/20
    p-3
    text-sm
    text-white
  `),
  classNamesForCells: twJoin(`
    relative
    group-hover/table-row:text-palette-green
    sm:group-[&.has-voted]/table-row:border-y-2
    sm:group-[&.has-voted]/table-row:border-palette-green
    sm:group-[&.has-voted:hover]/table-row:text-palette-green
    sm:group-[&.has-voted]/table-row:first:border-l-2
    sm:group-[&.has-voted]/table-row:last:border-r-2
  `),
  hasVotedIcon: twJoin(`
    relative
    -translate-y-1
    text-3xl
    text-palette-green
  `),
  hasVotedLabel: twJoin(`
    absolute
    left-1/2
    top-full
    flex
    w-min
    -translate-x-1/2
    -translate-y-1/2
    items-center
    gap-2
    whitespace-nowrap
    rounded-full
    bg-palette-green
    p-1
    text-[8px]
    leading-none
    text-palette-text
  `),
  projectLogo: twJoin(`
    relative
    size-12
  `),
  projectTitle: twJoin(`
    line-clamp-2
    text-lg
    font-semibold
  `),
  projectLink: twJoin(`
    absolute
    inset-0
    z-0
    h-full
    w-full
  `),
  noBids: twJoin(`
    !mb-6
    rounded-md
    border
    border-dashed
    border-palette-beige/20
    py-12
    text-center
    text-white/60
  `),
  hasVotedRow: twJoin(`
    has-voted
    max-sm:bg-palette-green
    max-sm:text-palette-text
    max-sm:hover:bg-palette-green/80
  `),
}
