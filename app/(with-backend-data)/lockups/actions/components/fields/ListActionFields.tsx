"use client"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useEffect, useState } from "react"
import { isListedMarketplaceLockup } from "../../../marketplace/utils/isListedMarketplaceLockup"
import { formatDenomAmount } from "../../../utils/formatDenomAmount"
import { getAllowedPaymentDenoms } from "../../../utils/getAllowedPaymentDenoms"
import { getDenomExponent } from "../../../utils/getDenomExponent"
import { getDisplayDenom } from "../../../utils/getDisplayDenom"
import { LockupActionFormProps } from "../../types"
import { LockupActionSubmit } from "../LockupActionSubmit"

export default function ListActionFields(props: LockupActionFormProps<"list">) {
  const {
    lockup,
    payload,
    onChange,
    onClose,
    onConfirm,
    isProcessing,
    isFormValid,
  } = props
  const isListed = isListedMarketplaceLockup(lockup)
  const [priceInput, setPriceInput] = useState<string>(
    String(
      isListed
        ? formatDenomAmount(
            lockup.listing.price.amount,
            getDenomExponent(lockup.listing.price.denom),
          )
        : lockup.funds.amount,
    ),
  )
  useEffect(() => {
    if (payload?.price?.amount !== undefined) {
      setPriceInput(payload.price.amount)
    }
  }, [payload])

  const collections = useBackendData().collections
  const allowedPaymentDenoms = getAllowedPaymentDenoms(collections)
  const royalties = collections.find(
    (c) =>
      c.contract_address === process.env.NEXT_PUBLIC_HYDRO_CONTRACT_ADDRESS,
  )?.royalty_fee_bps

  const priceDisplayDenom = getDisplayDenom(allowedPaymentDenoms[0])

  return (
    <>
      <div className="flex flex-col gap-1">
        <StyledText as="ul" className=" text-end text-sm opacity-60">
          {royalties && (
            <StyledText as="li">Royalties: {royalties / 100} %</StyledText>
          )}
          {royalties && (
            <StyledText
              tooltip="this is the amount you will receive when a buyer purchases your NFT"
              as="li"
            >
              Proceeds:{" "}
              {Number(priceInput) -
                Number(priceInput) * (royalties / 100 / 100)}{" "}
              {priceDisplayDenom}
            </StyledText>
          )}
        </StyledText>
        <LockupActionSubmit
          action="list"
          onClose={onClose}
          onConfirm={onConfirm}
          isProcessing={isProcessing}
          isFormValid={isFormValid}
          payload={payload}
          lockup={lockup}
        />
      </div>
    </>
  )
}
