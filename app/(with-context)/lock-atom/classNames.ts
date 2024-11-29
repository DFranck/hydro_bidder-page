"use client"

export const classNames = {
  fixedOverlay:
    "fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md",
  card: "mb-4",
  cardContent: "space-y-4",
  cardFooter: "space-x-4",
  button: "cursor-pointer border-none bg-transparent text-white underline",
  formContainer: "space-y-8",
  radio:
    "peer flex items-center text-sm opacity-60 appearance-none rounded-full size-5 border-2 border-gray-300 checked:bg-palette-green checked:border-palette-green checked:shadow-[0_0_0_2px_theme('colors.palette.text')_inset] checked:opacity-100",
  radioLabel:
    "opacity-60 cursor-pointer peer-checked:opacity-100 peer-checked:font-bold whitespace-nowrap",
  infoBox:
    "flex gap-3 rounded-md bg-palette-cyan p-3 text-sm text-palette-text",
  validatorListItem: "mb-2 flex w-full flex-col rounded-lg border p-3",
  loaderCard: "bg-[#303132]/75 backdrop-blur",
}
