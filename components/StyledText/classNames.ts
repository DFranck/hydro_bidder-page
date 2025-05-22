import { twJoin, twMerge } from "tailwind-merge"

const commonBaseButtonStyles = twJoin(
  "rounded-md border-2 text-center font-semibold leading-none sm:w-min sm:whitespace-nowrap"
)

const allClickableText = twJoin(
  "relative z-10 inline-flex grow-0 cursor-pointer items-center justify-center gap-1.5 transition-all hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
)

const buttonStyles = {
  allClickableText,
  sizeVariants: {
    small: "px-4 py-2 text-xs",
    medium: "px-6 py-3 text-sm",
    large: "px-8 py-4 text-lg",
  },
  primaryBase: twJoin(
    commonBaseButtonStyles,
    "border-palette-green bg-palette-green text-palette-text"
  ),
  secondaryBase: twJoin(
    commonBaseButtonStyles,
    "border-palette-green text-palette-green backdrop-blur-md"
  ),
  neutralBase: twJoin(
    commonBaseButtonStyles,
    "border-white bg-white text-palette-text"
  ),
  tertiaryBase: twJoin(
    commonBaseButtonStyles,
    "border-palette-cyan bg-palette-cyan text-palette-text"
  ),
  circularPrimary: twMerge(
    commonBaseButtonStyles,
    "size-10! rounded-full border-2 border-transparent bg-palette-green p-0! text-palette-text hover:bg-palette-green/80"
  ),
  circularSecondary: twMerge(
    commonBaseButtonStyles,
    "size-10! rounded-full border-2 border-palette-green p-0! text-palette-green hover:bg-palette-green hover:text-palette-text"
  ),
  circularIcon: twMerge(
    commonBaseButtonStyles,
    "size-10! rounded-full border-0 p-0! text-white/60 hover:bg-white/20 hover:text-white"
  ),
}

const classNamesForAllHeadings = twJoin(
  "font-display text-balance font-bold leading-[1.3]!"
)

const generateButtonClassNames = (
  type:
    | "primary"
    | "secondary"
    | "neutral"
    | "tertiary"
    | "circular-primary"
    | "circular-secondary"
    | "circular-icon",
  size: "small" | "medium" | "large" = "medium"
) => {
  const baseStyles = {
    primary: buttonStyles.primaryBase,
    secondary: buttonStyles.secondaryBase,
    neutral: buttonStyles.neutralBase,
    tertiary: buttonStyles.tertiaryBase,
    "circular-primary": buttonStyles.circularPrimary,
    "circular-secondary": buttonStyles.circularSecondary,
    "circular-icon": buttonStyles.circularIcon,
  }

  const sizeStyles = buttonStyles.sizeVariants[size]

  return twMerge(allClickableText, baseStyles[type], sizeStyles)
}

export const classNames = {
  badge: twJoin(
    "rounded-full px-2 py-0.5 text-xs",
    "bg-palette-beige text-xs text-palette-text"
  ),

  link: twMerge(
    allClickableText,
    "inline text-palette-green underline underline-offset-4",
    "hover:scale-100 hover:underline-offset-8"
  ),

  "link.subtle": twMerge(
    allClickableText,
    "inline text-white/80 hover:underline"
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
  "button.tertiary": generateButtonClassNames("tertiary"),
  "button.tertiary.large": generateButtonClassNames("tertiary", "large"),
  "button.tertiary.small": generateButtonClassNames("tertiary", "small"),
  "button.circular.primary": generateButtonClassNames("circular-primary"),
  "button.circular.secondary": generateButtonClassNames("circular-secondary"),
  "button.circular.icon": generateButtonClassNames("circular-icon"),

  footnote: twJoin("text-sm leading-relaxed text-white/60"),

  superHeading: twMerge(
    classNamesForAllHeadings,
    "font-medium uppercase tracking-wide text-palette-beige"
  ),

  h1: twMerge(classNamesForAllHeadings, "leading-[1.1]! text-6xl"),
  h2: twMerge(classNamesForAllHeadings, "text-4xl"),
  h3: twMerge(classNamesForAllHeadings, "text-3xl"),
  h4: twMerge(classNamesForAllHeadings, "font-body text-lg"),

  "icon.huge": twJoin("text-8xl"),

  "input.text": twJoin(
    "rounded border-2 bg-white/20 p-2 outline-none",
    "invalid:border-palette-red!",
    "focus:border-palette-green"
  ),

  "input.checkbox": twJoin(
    "size-5 appearance-none rounded border-2 outline-none",
    "checked:border-transparent",
    "checked:bg-palette-green",
    `checked:shadow-[0_0_0_2px_var(--color-palette-text)_inset]`
  ),

  "input.radio": twJoin(
    "size-5 appearance-none rounded-full border-2 outline-none",
    "checked:border-transparent",
    "checked:bg-palette-green",
    `checked:shadow-[0_0_0_3px_var(--color-palette-text)_inset]`
  ),

  label: twJoin(
    "whitespace-nowrap text-sm text-white/80",
    "has-checked:font-bold has-checked:text-white"
  ),

  "mathSymbol.container": twJoin(
    "inline-flex items-center gap-0.5 whitespace-nowrap"
  ),

  mathSymbol: twJoin("text-sm font-bold opacity-80"),

  "progressBar.container": twJoin(
    "flex items-center",
    "h-4 w-full",
    "overflow-hidden rounded-full",
    "border-2 border-palette-beige"
  ),

  progressBar: twJoin(
    "h-full w-fit px-2",
    "flex items-center",
    "bg-palette-beige font-bold text-palette-text"
  ),
}
