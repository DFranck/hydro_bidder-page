"use client"

import { cn } from "@/lib/utils"
import { MintingStep } from "@/app/(with-backend-data)/lockups/MintNfts"
import { AlertCircle, Check, Loader2 } from "lucide-react"

interface Props {
  steps: MintingStep[]
}

export function MintNftCardStepper({ steps }: Props) {
  return (
    <div className="mx-auto mb-4 flex flex-row justify-start gap-y-4 md:justify-center md:gap-y-0 ">
      {steps.map((el, index) => (
        <div key={el.id} className="flex items-center">
          <div className="flex w-10 flex-1 flex-col items-center gap-3">
            <div className="flex flex-row items-center justify-center">
              <div
                className={cn(
                  "flex size-10 flex-col items-center justify-center rounded-full border-2 text-lg font-semibold transition-colors",
                  {
                    "border-palette-green/70 bg-palette-green/70 text-white":
                      el.status === "success",
                    "border-red-500 bg-red-500 text-white":
                      el.status === "error",
                    "border-palette-blue/90 bg-palette-blue/90 text-white":
                      el.status === "pending",
                    "border-gray-200 bg-white text-gray-400":
                      el.status === "default",
                  }
                )}
              >
                {el.status === "success" ? (
                  <Check size={20} />
                ) : el.status === "error" ? (
                  <AlertCircle size={20} />
                ) : el.status === "pending" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  el.id
                )}
              </div>
            </div>
            <div className="pt-2 ">
              <p
                className={cn("text-sm font-medium whitespace-nowrap", {
                  "text-palette-green/90": el.status === "success",
                  "text-red-600": el.status === "error",
                  "text-palette-blue/90": el.status === "pending",
                  "text-gray-500": el.status === "default",
                })}
              >
                {el.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn("-mt-10  h-0.5 w-6 bg-gray-200 md:w-16", {
                "bg-palette-green/90": el.status === "success",
                "bg-palette-blue/90": el.status === "pending",
              })}
            />
          )}
        </div>
      ))}
    </div>
  )
}
