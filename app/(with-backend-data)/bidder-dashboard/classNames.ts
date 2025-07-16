import { twJoin } from "tailwind-merge"

export const classNames = {
  classNamesForCells: twJoin(`
    relative
    group-hover/table-row:text-palette-green
  `),
  openedRow: twJoin(`
    rounded-b-none!
    bg-transparent!
    [&>td]:rounded-b-none!
    [&>td]:bg-palette-green/10!
  `),
  additionalRow: twJoin(`
    -mt-1
    rounded-b-md
    bg-transparent!
    max-sm:block
    [&>td]:rounded-t-none!
    [&>td]:bg-palette-green/10!
    [&>td]:p-6!
  `),
}
