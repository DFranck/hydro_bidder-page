'use client'

import { Icon } from '@/components/Icon'
import { IconString } from '@/components/Icon/types'
import { useIsMobile } from '@/lib/useIsMobile'
import { InternalLink } from '@v2/components/InternalLink'
import { SubmenuDropdown } from '@v2/components/SubmenuDropdown'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { twJoin, twMerge } from 'tailwind-merge'

export interface MenuItem extends React.ComponentProps<'a'> {
  disabled?: boolean
  href?: string
  iconLeft?: IconString
  iconRight?: IconString
  label: ReactNode
  menuItems?: MenuItem[]
  target?: string
  tooltip?: ReactNode
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
  classNameForMenuButton,
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
  classNameForMenuButton?: string
}) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

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
        'desktop:w-auto',
        className,
      )}
      {...otherProps}
    >
      <button
        className={twJoin(
          'cursor-pointer',
          'transition-all duration-500',
          'group-focus-within/navbar:rotate-180',
          'pointer-events-auto',
          'desktop:hidden',
          classNameForMenuButton,
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
          'transition-all duration-500',
          'translate-x-full opacity-0',
          'group-focus-within/navbar:translate-x-0',
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
          'transition-all duration-500',
          'translate-x-full opacity-0',
          'group-focus-within/navbar:translate-x-0',
          'group-focus-within/navbar:opacity-100',
          'desktop:translate-x-0',
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
              <InternalLink
                key={href ?? index}
                href={href ?? '#'}
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
              </InternalLink>
            ) : (
              <div
                className="group/nav-item relative cursor-pointer"
                key={index}
              >
                {isMobile ? (
                  // Mobile: Simple link with inline submenu
                  <>
                    <a
                      href={href ?? '#'}
                      tabIndex={0}
                      className={twJoin(
                        'flex items-center gap-2',
                        'w-full justify-between',
                      )}
                    >
                      {iconLeft && <Icon name={iconLeft} />}
                      <span>{label}</span>
                      {iconRight && <Icon name={iconRight} />}
                    </a>

                    {/* Mobile: Inline submenu list */}
                    <div
                      className={twJoin(
                        'flex flex-col',
                        'border-l-palette-beige border-l-2', // Only for mobile
                        classNameForSubItems,
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
                          <InternalLink
                            key={subIndex}
                            href={href ?? '#'}
                            disabled={disabled}
                            className={twJoin(
                              'flex items-center gap-2',
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
                            {iconLeft && <Icon name={iconLeft} />}
                            <span>{label}</span>
                            {iconRight && <Icon name={iconRight} />}
                          </InternalLink>
                        ),
                      )}
                    </div>
                  </>
                ) : (
                  // Desktop: SubmenuDropdown component
                  <SubmenuDropdown
                    trigger={
                      <a
                        href={href ?? '#'}
                        tabIndex={0}
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
                    }
                    classNameForMenu={classNameForSubItems}
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
                        <InternalLink
                          key={subIndex}
                          href={href ?? '#'}
                          disabled={disabled}
                          className={twJoin(
                            'flex items-center gap-2',
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
                          {iconLeft && <Icon name={iconLeft} />}
                          <span>{label}</span>
                          {iconRight && <Icon name={iconRight} />}
                        </InternalLink>
                      ),
                    )}
                  </SubmenuDropdown>
                )}
              </div>
            )
          },
        )}
      </div>
    </nav>
  )
}
