import { twJoin, twMerge } from 'tailwind-merge'

export const classNames = {
  backdrop: ({ modalState = 'closed' }) =>
    twMerge(
      `
      fixed
      left-0
      top-0
      z-10
      h-screen
      w-full
      transition-all
      duration-500
    `,
      modalState === 'opening' || modalState === 'open'
        ? `
          pointer-events-auto
          bg-shadedBgColor
          opacity-100
          backdrop-blur-md
        `
        : `
          pointer-events-none
          bg-transparent
          opacity-0
          backdrop-blur-none
        `,
    ),

  container: ({ modalState = 'closed' }) =>
    twMerge(
      `
      bg-appBgColor
      fixed
      left-1/2
      top-1/2
      z-10
      min-w-64
      -translate-x-1/2
      overflow-hidden
      rounded-lg
      shadow-xl
      duration-500
    `,
      modalState === 'opening' || modalState === 'open'
        ? `
          -translate-y-1/2
          opacity-100
        `
        : `
          pointer-events-none
          -translate-y-full
          opacity-0
        `,
    ),

  header: twJoin(`
    bg-accentColor
    px-3
    py-1
    font-bold
    text-white
  `),

  body: twJoin(`
    p-3
  `),

  buttons: twJoin(`
    flex
    flex-row-reverse
    gap-1
    p-3
  `),
}
