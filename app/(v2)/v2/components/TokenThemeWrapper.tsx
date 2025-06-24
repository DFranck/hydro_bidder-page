const tokenColorVars: Record<number, string> = {
  1: 'var(--color-token-atom)',
  2: 'var(--color-token-usdc)',
}

type TokenThemeWrapperProps<C extends React.ElementType> = {
  as?: C
  trancheId: number
  children: React.ReactNode
  className?: string
} & Omit<React.ComponentPropsWithoutRef<C>, 'as'>

export const TokenThemeWrapper = <C extends React.ElementType = 'div'>({
  as,
  trancheId,
  children,
  className,
  ...otherProps
}: TokenThemeWrapperProps<C>) => {
  const Component = as || 'div'
  const style = {
    '--color-theme-color': tokenColorVars[trancheId],
  } as React.CSSProperties

  return (
    <Component style={style} className={className} {...otherProps}>
      {children}
    </Component>
  )
}
