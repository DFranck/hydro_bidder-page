import { twJoin } from "tailwind-merge"

export const classNames = {
  classNamesForCells: twJoin(`
    relative
    group-hover/table-row:text-palette-green
  `),
  openedRow: twJoin(`
    !border-0
    !bg-palette-green/5
    max-sm:!rounded-bl-none
    max-sm:!rounded-br-none
    [&>td]:!rounded-bl-none
    [&>td]:!rounded-br-none
    [&>td]:!border-0
    [&>td]:sm:!bg-palette-green/5
  `),
  additionalRow: twJoin(`
    -mt-1
    !bg-palette-green/5
    max-sm:!rounded-tl-none
    max-sm:!rounded-tr-none
  `),
  additionalCell: twJoin(`
    !rounded-tl-none
    !rounded-tr-none
    !border-0
    p-6
    sm:!bg-palette-green/5
  `),
}
