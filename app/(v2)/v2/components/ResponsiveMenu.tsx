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
  classNameForBackdrop,
  classNameForBackground,
  classNameForItems,
  classNameForItem,
  classNameForSubItem,
  classNameForSubItems,
  classNameForSubItemActive,
  ...otherProps
}: React.ComponentProps<'nav'> & {
  menuItems: MenuItem[]
  className?: string
  classNameForBackdrop?: string
  classNameForBackground?: string
  classNameForItems?: string
  classNameForItem?: string
  classNameForSubItem?: string
  classNameForSubItems?: string
  classNameForSubItemActive?: string
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
        'bg-transparent',
        'pointer-events-none',
        'fixed top-0 right-0 h-full w-2/3',
        'transition-all duration-500',
        'focus-within:pointer-events-auto',
        'desktop:pointer-events-auto',
        'desktop:relative',
        'desktop:flex',
        className,
      )}
      {...otherProps}
    >
      <button
        className={twJoin(
          'top-tight right-tight fixed z-40 size-12',
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
          'opacity-0 transition-all duration-500',
          'group-focus-within/navbar:opacity-100',
          classNameForItems,
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
                className="group/nav-item relative cursor-pointer"
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
                    'desktop:absolute',
                    'desktop:top-full',
                    'desktop:left-1/2',
                    'desktop:-translate-x-1/2',
                    'desktop:pointer-events-none',
                    'desktop:opacity-0',
                    'desktop:transition-all',
                    'desktop:group-focus-within/nav-item:opacity-100',
                    'desktop:group-focus-within/nav-item:pointer-events-auto',
                  )}
                >
                  <div
                    className={twJoin('flex flex-col', classNameForSubItems)}
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
                            href &&
                              pathname?.startsWith(href) &&
                              classNameForSubItemActive,
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
