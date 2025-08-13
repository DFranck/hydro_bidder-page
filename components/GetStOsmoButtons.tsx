import { Icon } from "@/components/Icon"
import Image from "next/image"
import { ComponentProps } from "react"
import { twJoin, twMerge } from "tailwind-merge"

export const skipUrl =
  "https://go.skip.build?src_asset=uosmo&src_chain=osmosis-1&dest_asset=ibc%2F75249A18DEFBEFE55F83B1C70CAD234DF164F174C6BC51682EE92C2C81C18C93&dest_chain=neutron-1&amount_in=&amount_out="

export const strideUrl = "https://app.stride.zone/?chain=OSMO"

export function GetStOsmoButtons({
  className,
  ...props
}: ComponentProps<"span"> & { className?: string }) {
  return (
    <span
      className={twMerge("inline-flex items-center gap-2", className)}
      {...props}
    >
      <span>
        Get <strong>stOSMO</strong> with
      </span>{" "}
      <a
        className={twJoin(
          "inline-flex items-center gap-1",
          "rounded-lg border-2 border-white px-2 py-0.5",
          "transition-all",
          "bg-tokens-stosmo hover:bg-tokens-stosmo/80",
        )}
        target="_blank"
        href={skipUrl}
      >
        <span className="relative inline-block h-5 w-8">
          <Image alt="" src="/images/logo-skip.svg" fill={true} sizes="2vw" />
        </span>

        <Icon name="regular:arrow-up-right-from-square" />
      </a>{" "}
      <span>or</span>{" "}
      <a
        className={twJoin(
          "inline-flex items-center gap-1",
          "rounded-lg border-2 border-white px-2 py-0.5",
          "transition-all",
          "bg-tokens-stosmo hover:bg-tokens-stosmo/80",
        )}
        target="_blank"
        href={strideUrl}
      >
        <span className="relative inline-block h-5 w-12">
          <Image alt="" src="/images/logo-stride.svg" fill={true} sizes="2vw" />
        </span>
        <Icon name="regular:arrow-up-right-from-square" />
      </a>
    </span>
  )
}
