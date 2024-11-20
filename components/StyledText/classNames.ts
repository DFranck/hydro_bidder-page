import { twJoin, twMerge } from "tailwind-merge"

const commonBaseButtonStyles = twJoin(`
  rounded-md
  border-2
  text-center
  font-semibold
  leading-none
  sm:w-min
  sm:whitespace-nowrap
`)

const allClickableText = twJoin(`
  relative
  z-10
  inline-flex
  grow-0
  cursor-pointer
  items-center
  justify-center
  gap-1.5
  transition-all
  hover:scale-105
  disabled:pointer-events-none
  disabled:opacity-40
`)

const buttonStyles = {
  allClickableText,
  sizeVariants: {
    small: `
      px-4
      py-2
      text-xs
    `,
    medium: `
      px-6
      py-3
      text-sm
    `,
    large: `
      px-8
      py-4
      text-lg
    `,
  },
  primaryBase: twJoin(
    commonBaseButtonStyles,
    `
      border-palette-green
      bg-palette-green
      text-palette-text
    `
  ),
  secondaryBase: twJoin(
    commonBaseButtonStyles,
    `
      border-palette-green
      text-palette-green
      backdrop-blur-md
    `
  ),
  neutralBase: twJoin(
    commonBaseButtonStyles,
    `
      border-white
      bg-white
      text-palette-text
    `
  ),
  circularPrimary: twMerge(
    commonBaseButtonStyles,
    `
      !size-10
      rounded-full
      border-2
      border-transparent
      bg-palette-green
      !p-0
      text-palette-text
      hover:bg-palette-green/80
    `
  ),
  circularSecondary: twMerge(
    commonBaseButtonStyles,
    `
      !size-10
      rounded-full
      border-2
      border-palette-green
      !p-0
      text-palette-green
      hover:bg-palette-green
      hover:text-palette-text
    `
  ),
}

const classNamesForAllHeadings = twJoin(`
  font-display
  text-balance
  font-bold
`)

const generateButtonClassNames = (
  type:
    | "primary"
    | "secondary"
    | "neutral"
    | "circular-primary"
    | "circular-secondary",
  size: "small" | "medium" | "large" = "medium"
) => {
  const baseStyles = {
    primary: buttonStyles.primaryBase,
    secondary: buttonStyles.secondaryBase,
    neutral: buttonStyles.neutralBase,
    "circular-primary": buttonStyles.circularPrimary,
    "circular-secondary": buttonStyles.circularSecondary,
  }

  const sizeStyles = buttonStyles.sizeVariants[size]

  return twMerge(allClickableText, baseStyles[type], sizeStyles)
}

export const classNames = {
  link: twMerge(
    allClickableText,
    `
      inline
      text-palette-green
      underline
      underline-offset-4
      hover:scale-100
      hover:underline-offset-8
    `
  ),
  "link.subtle": twMerge(
    allClickableText,
    `
      inline
      text-white/80
      hover:underline
    `
  ),
  "button.primary": generateButtonClassNames("primary"),
  "button.primary.large": generateButtonClassNames("primary", "large"),
  "button.primary.small": generateButtonClassNames("primary", "small"),
  "button.secondary": generateButtonClassNames("secondary"),
  "button.secondary.large": generateButtonClassNames("secondary", "large"),
  "button.secondary.small": generateButtonClassNames("secondary", "small"),
  "button.neutral": generateButtonClassNames("neutral"),
  "button.neutral.large": generateButtonClassNames("neutral", "large"),
  "button.neutral.small": generateButtonClassNames("neutral", "small"),
  "button.circular.primary": generateButtonClassNames("circular-primary"),
  "button.circular.secondary": generateButtonClassNames("circular-secondary"),
  footnote: twJoin(`
    text-sm
    leading-relaxed
    text-white/60
  `),
  superHeading: twMerge(
    classNamesForAllHeadings,
    `
      font-medium
      uppercase
      tracking-wide
      text-palette-beige
    `
  ),
  h1: twMerge(
    classNamesForAllHeadings,
    `
      text-6xl
    `
  ),
  h2: twMerge(
    classNamesForAllHeadings,
    `
      text-4xl
    `
  ),
  h3: twMerge(
    classNamesForAllHeadings,
    `
      text-3xl
    `
  ),
  h4: twMerge(
    classNamesForAllHeadings,
    `
      font-body
      text-lg
    `
  ),
  label: twJoin(`
    whitespace-nowrap
    text-sm
    text-white/80
    has-[:checked]:font-bold
    has-[:checked]:text-white
  `),
  "input.text": twJoin(`
    rounded
    border-2
    bg-white/20
    p-2
    outline-none
    invalid:!border-palette-red
    focus:border-palette-green
  `),
  "input.checkbox": twJoin(`
    size-5
    appearance-none
    rounded
    border-2
    outline-none
    checked:border-transparent
    checked:bg-palette-green
    checked:shadow-[0_0_0_2px_theme('colors.palette.text')_inset]
  `),
  "input.radio": twJoin(`
    size-5
    appearance-none
    rounded-full
    border-2
    outline-none
    checked:border-transparent
    checked:bg-palette-green
    checked:shadow-[0_0_0_2px_theme('colors.palette.text')_inset]
  `),
}
