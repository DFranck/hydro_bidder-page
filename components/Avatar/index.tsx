import { Avatar as AvatarWrapper, AvatarImage } from "@/components/ui/avatar"

export function Avatar({
  className,
  url,
  fallbackSrc = "/images/Question_BLANK.png",
  alt,
}: {
  className?: string
  url?: string
  fallbackSrc?: string
  alt: string
}) {
  return (
    <AvatarWrapper className={className}>
      <AvatarImage
        className="aspect-auto"
        src={url ?? fallbackSrc}
        alt={alt}
      />
    </AvatarWrapper>
  )
}
