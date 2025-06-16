'use client'

import { Icon } from '@/components/Icon'
import { IconString } from '@/components/Icon/types'
import { StyledText } from '@/components/StyledText'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twJoin, twMerge } from 'tailwind-merge'

export interface MenuItem extends React.ComponentProps<'a'> {
  disabled?: boolean
  href?: string
  iconLeft?: IconString
  iconRight?: IconString
  label: React.ReactNode
  menuItems?: MenuItem[]
  target?: string
  tooltip?: React.ReactNode
}

export function ResponsiveMenu({
  menuItems,
  className,
  classNameDesktop,
  classNameMobile,
  classNameForBackdrop,
  classNameForBackground,
  classNameForItem,
  classNameForSubItem,
  classNameForSubItems,
  ...otherProps
}: React.ComponentProps<'nav'> & {
  menuItems: MenuItem[]
  className?: string
  classNameDesktop?: string
  classNameMobile?: string
  classNameForBackdrop?: string
  classNameForBackground?: string
  classNameForItem?: string
  classNameForSubItem?: string
  classNameForSubItems?: string
}) {
  const pathname = usePathname()

  function blurActiveElement() {
    ;(document.activeElement as HTMLDivElement)?.blur()
  }

  return (
    <nav
      tabIndex={0}
      className={twMerge(
        'group/navbar z-40',
        'relative bg-transparent',
        'pointer-events-none',
        'fixed top-0 right-0 h-full w-2/3 overflow-hidden',
        'transition-all duration-500',
        'focus-within:pointer-events-auto',
        classNameDesktop,
        classNameMobile,
        className,
      )}
      {...otherProps}
    >
      <button
        className={twJoin(
          'fixed top-0 right-0 z-40 size-12',
          'flex cursor-pointer',
          'transition-all duration-500',
          'group-focus-within/navbar:rotate-180',
          'pointer-events-auto block',
          'desktop:hidden',
        )}
      >
        <span
          className={twJoin(
            'absolute inset-0 flex items-center justify-center',
            'text-2xl',
            'opacity-100 transition-all duration-500',
            'group-focus-within/navbar:opacity-0',
          )}
        >
          <Icon name="solid:bars" />
        </span>

        <span
          className="
            pointer-events-none
            absolute inset-0 flex items-center justify-center
            text-2xl
            opacity-0 transition-all duration-500
            group-focus-within/navbar:pointer-events-auto
            group-focus-within/navbar:opacity-100
          "
          onClick={blurActiveElement}
        >
          <Icon name="solid:xmark" />
        </span>
      </button>

      {/* Backdrop */}
      <div
        className={twMerge(
          'pointer-events-none',
          'fixed inset-0 z-10',
          'opacity-0',
          'transition-all duration-500',
          'group-focus-within/navbar:pointer-events-auto',
          'group-focus-within/navbar:opacity-100',
          'block',
          'desktop:hidden',
          classNameForBackdrop,
        )}
        onClick={blurActiveElement}
      />

      {/* Mobile Menu Background */}
      <div
        className={twMerge(
          'pointer-events-none',
          'absolute inset-0 z-20',
          'opacity-0 transition-all duration-500',
          'group-focus-within/navbar:opacity-100',
          'block',
          'desktop:hidden',
          classNameForBackground,
        )}
      />

      {/* Menu Items */}
      <div
        className={twMerge(
          'relative z-30',
          'px-6 py-12',
          'flex',
          'justify-between',
          'desktop:flex-row flex-col',
          'desktop:gap-6 gap-3',
          'desktop:items-center',
          'opacity-0 transition-all duration-500',
          'group-focus-within/navbar:opacity-100',
        )}
      >
        {menuItems.map(
          (
            {
              label,
              href,
              disabled,
              tooltip,
              iconLeft,
              iconRight,
              menuItems: subMenuItems,
              onClick,
              ...otherProps
            },
            index,
          ) => {
            const hasMenuItems = !!subMenuItems?.length

            return !hasMenuItems ? (
              <StyledText
                key={href}
                as={Link}
                href={href ?? '#'}
                tooltip={tooltip}
                className={twJoin(
                  disabled && 'pointer-events-none opacity-60',
                  classNameForItem,
                  pathname?.startsWith(href ?? '') &&
                    'text-palette-beige font-bold',
                )}
                onClick={(event) => {
                  onClick?.(event)
                  blurActiveElement()
                }}
                {...otherProps}
              >
                {label}
              </StyledText>
            ) : (
              <div
                className={twJoin(
                  'group relative cursor-pointer',
                  'flex flex-col justify-center',
                  'items-center',
                  'w-full gap-3',
                  'desktop:w-auto',
                  'desktop:gap-0',
                )}
                key={index}
              >
                <a
                  href={href ?? '#'}
                  className={twJoin(
                    'flex items-center gap-2',
                    'w-full justify-between',
                    'desktop:w-auto',
                  )}
                >
                  {iconLeft && <Icon name={iconLeft} />}
                  <span>{label}</span>
                  {iconRight && <Icon name={iconRight} />}
                </a>

                <div
                  className={twJoin(
                    'absolute top-full left-0',
                    'group-hover:block',
                    'relative block',
                    'group-hover:hidden',
                    'group-focus-within:block',
                    'desktop:hidden',
                  )}
                >
                  <div
                    className={twJoin(
                      'flex flex-col gap-2',
                      'bg-transparent p-0',
                      'desktop:p-2',
                      'desktop:bg-shaded',
                      'desktop:rounded-standard',
                    )}
                  >
                    {subMenuItems.map(
                      (
                        {
                          label,
                          href,
                          disabled,
                          tooltip,
                          iconLeft,
                          iconRight,
                          menuItems,
                          onClick,
                          ...otherProps
                        },
                        subIndex,
                      ) => (
                        <StyledText
                          key={subIndex}
                          as={Link}
                          href={href ?? '#'}
                          tooltip={tooltip}
                          className={twJoin(
                            disabled && 'pointer-events-none opacity-60',
                            classNameForSubItem,
                            pathname?.startsWith(href ?? '') &&
                              'text-palette-beige font-bold',
                          )}
                          onClick={(event) => {
                            onClick?.(event)
                            blurActiveElement()
                          }}
                          {...otherProps}
                        >
                          {label}
                        </StyledText>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )
          },
        )}
      </div>
    </nav>
  )
}
