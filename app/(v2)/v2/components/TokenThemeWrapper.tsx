import { SourceID } from '@v2/types'

const tokenColorVars: Record<string, string> = {
  atom: 'var(--color-token-atom)',
  stosmo: 'var(--color-token-stosmo)',
}

type TokenThemeWrapperProps<C extends React.ElementType> = {
  as?: C
  sourceId: SourceID
  children: React.ReactNode
  className?: string
} & Omit<React.ComponentPropsWithoutRef<C>, 'as'>

export const TokenThemeWrapper = <C extends React.ElementType = 'div'>({
  as,
  sourceId,
  children,
  className,
  ...otherProps
}: TokenThemeWrapperProps<C>) => {
  const Component = as || 'div'
  const style = {
    '--color-theme-color': tokenColorVars[sourceId],
  } as React.CSSProperties

  return (
    <Component style={style} className={className} {...otherProps}>
      {children}
    </Component>
  )
}
