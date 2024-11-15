"use client"

import { ContentContainer } from "@/components/ContentContainer"
import { Toasts, useToasts } from "@/components/Toasts"
import { classNames } from "@/components/Toasts/classNames"

const variants = Object.keys(
  classNames.variants
) as (keyof typeof classNames.variants)[]

export default function SandboxPage() {
  const { setToasts } = useToasts()

  return (
    <ContentContainer className="flex max-w-96 flex-col gap-2">
      {variants.map((variant) => (
        <Toasts.Toast
          key={variant}
          isDismissible={false}
          variant={variant}
          onClick={() =>
            setToasts((toasts) => [
              ...toasts,
              { variant, message: "Hello", isDismissible: true },
            ])
          }
        >
          Show {variant} toast
        </Toasts.Toast>
      ))}
    </ContentContainer>
  )
}
