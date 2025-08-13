import {
  Alert as AlertWrapper,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"

export function Alert({
  className,
  title,
  description,
  variant,
  icon,
}: {
  className?: string
  title: string
  description: string
  variant: "default" | "destructive" | null | undefined
  icon?: React.ReactNode
}) {
  return (
    <AlertWrapper variant={variant} className={className}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </AlertWrapper>
  )
}
