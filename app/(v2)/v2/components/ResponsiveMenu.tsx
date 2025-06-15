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
  classNameForBackdropMobile,
  classNameForBackgroundMobile,
  classNameForItemDesktop,
  classNameForItemMobile,
  classNameForSubItemDesktop,
  classNameForSubItemMobile,
  classNameForSubItemsDesktop,
  classNameForSubItemsMobile,
  ...otherProps
}: React.ComponentProps<'nav'> & {
  menuItems: MenuItem[]
  className?: string
  classNameDesktop?: string
  classNameMobile?: string
  classNameForBackdropMobile?: string
  classNameForBackgroundMobile?: string
  classNameForItemDesktop?: string
  classNameForItemMobile?: string
  classNameForSubItemDesktop?: string
  classNameForSubItemMobile?: string
  classNameForSubItemsDesktop?: string
  classNameForSubItemsMobile?: string
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
        'mobile:pointer-events-none',
        'mobile:fixed mobile:top-0 mobile:right-0 mobile:h-full mobile:w-2/3 mobile:overflow-hidden',
        'mobile:transition-all mobile:duration-500',
        'mobile:focus-within:pointer-events-auto',
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
          'hidden',
          'mobile:pointer-events-auto mobile:block',
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
          'hidden',
          'mobile:block',
          classNameForBackdropMobile,
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
          'hidden',
          'mobile:block',
          classNameForBackgroundMobile,
        )}
      />

      {/* Menu Items */}
      <div
        className={twMerge(
          'relative z-30',
          'flex',
          'flex-row items-center gap-6',
          'mobile:flex-col mobile:justify-between',
          'mobile:gap-3 mobile:px-6 mobile:py-12',
          'mobile:opacity-0 mobile:transition-all mobile:duration-500',
          'mobile:group-focus-within/navbar:opacity-100',
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
                  classNameForItemDesktop,
                  'mobile:' + classNameForItemMobile,
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
                  'mobile:w-full mobile:gap-3',
                )}
                key={index}
              >
                <a
                  href={href ?? '#'}
                  className={twJoin(
                    'flex items-center gap-2',
                    'mobile:w-full mobile:justify-between',
                  )}
                >
                  {iconLeft && <Icon name={iconLeft} />}
                  <span>{label}</span>
                  {iconRight && <Icon name={iconRight} />}
                </a>

                <div
                  className={twJoin(
                    'absolute top-full left-0',
                    'hidden group-hover:block',
                    'mobile:relative mobile:block',
                    'mobile:group-hover:hidden',
                    'mobile:group-focus-within:block',
                  )}
                >
                  <div
                    className={twJoin(
                      'flex flex-col gap-2',
                      'p-2',
                      'bg-shaded rounded-standard',
                      'mobile:bg-transparent mobile:p-0',
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
                            classNameForSubItemDesktop,
                            'mobile:' + classNameForSubItemMobile,
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
