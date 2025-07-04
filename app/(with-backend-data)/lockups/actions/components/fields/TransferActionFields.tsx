"use client"

import { StyledText } from "@/components/StyledText"
import { useMarketplaceData } from "../../../marketplace/context/MarketplaceDataProvider"
import { LockupActionFormProps } from "../../types"
import { LockupActionSubmit } from "../LockupActionSubmit"
export default function TransferActionFields(
  props: LockupActionFormProps<"transfer">,
) {
  const { payload, onChange, onClose, onConfirm, isProcessing, isFormValid } =
    props
  return (
    <>
      <StyledText
        as="input"
        type="text"
        placeholder="neutron1______________________________________"
        className="w-full border-palette-beige/50 bg-black placeholder:text-palette-beige/50 focus:border-palette-beige"
        onChange={(e) => onChange({ receiverAddress: e.target.value })}
        variant="input.text"
      />
      <LockupActionSubmit
        action="transfer"
        onClose={onClose}
        onConfirm={onConfirm}
        isProcessing={isProcessing}
        isFormValid={isFormValid}
        payload={payload}
      />
    </>
  )
}
