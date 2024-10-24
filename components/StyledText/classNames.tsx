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
            backdrop-blur-sm
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
}

const classNamesForAllHeadings = twJoin(`
    font-display
    font-bold
`)

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
            hover:underline
        `
    ),
    "button.primary": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.medium,
        buttonStyles.primaryBase
    ),
    "button.primary.large": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.large,
        buttonStyles.primaryBase
    ),
    "button.primary.small": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.small,
        buttonStyles.primaryBase
    ),
    "button.secondary": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.medium,
        buttonStyles.secondaryBase
    ),
    "button.secondary.large": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.large,
        buttonStyles.secondaryBase
    ),
    "button.secondary.small": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.small,
        buttonStyles.secondaryBase
    ),
    "button.neutral": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.medium,
        buttonStyles.neutralBase
    ),
    "button.neutral.large": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.large,
        buttonStyles.neutralBase
    ),
    "button.neutral.small": twMerge(
        allClickableText,
        buttonStyles.sizeVariants.small,
        buttonStyles.neutralBase
    ),
    "button.circular.primary": twMerge(
        allClickableText,
        `
            size-10
            rounded-full
            bg-palette-green
            hover:bg-palette-green/80
        `
    ),
    "button.circular.secondary": twMerge(
        allClickableText,
        `
            size-10
            rounded-full
            text-white
            hover:bg-palette-beige/20
        `
    ),
    footnote: twJoin(`
        text-xs
        leading-relaxed
        text-white/60
    `),
    h1: twMerge(
        classNamesForAllHeadings,
        `
            text-5xl
            [&>strong]:font-normal
            [&>strong]:text-palette-green/60
        `
    ),
    h2: twMerge(
        classNamesForAllHeadings,
        `
            text-4xl
            [&>strong]:font-normal
            [&>strong]:text-palette-green/60
        `
    ),
    h3: twMerge(
        classNamesForAllHeadings,
        `
            text-3xl
            [&>strong]:font-normal
            [&>strong]:text-palette-green/60
        `
    ),
    h4: twMerge(
        classNamesForAllHeadings,
        `
            font-body
            text-lg
        `
    ),
    importantValue: twJoin(`
        font-display
        text-5xl
        font-bold
    `),
    importantValueLabel: twJoin(`
        border-b-2
        pb-2
        text-xs
    `),
    label: twJoin(`
        text-sm
        text-white/80
    `),
}
