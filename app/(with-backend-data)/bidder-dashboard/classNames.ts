import { twJoin } from "tailwind-merge"

export const classNames = {
  classNamesForCells: twJoin(`
    relative
    group-hover/table-row:text-palette-green
  `),
  openedRow: twJoin(`
    !border-0 
    [&>td]:!border-0 
    [&>td]:!rounded-br-none 
    [&>td]:!rounded-bl-none 
    max-sm:!rounded-br-none 
    max-sm:!rounded-bl-none  
    [&>td]:sm:!bg-palette-green/5 
    !bg-palette-green/5
  `),
  additionalRow: twJoin(`
    !bg-palette-green/5 
    -mt-1 
    max-sm:!rounded-tr-none 
    max-sm:!rounded-tl-none
  `),
  additionalCell: twJoin(`
    !border-0 
    !rounded-tr-none 
    !rounded-tl-none 
    sm:!bg-palette-green/5 
    p-6
  `)
}
