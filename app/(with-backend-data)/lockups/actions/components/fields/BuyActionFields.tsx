"use client"
import { LockupActionFormProps } from "../../types"
import { LockupActionSubmit } from "../LockupActionSubmit"

export default function BuyActionFields(props: LockupActionFormProps<"buy">) {
  const { payload, onClose, onConfirm, isProcessing, isFormValid, isDisabled } =
    props
  return (
    <LockupActionSubmit
      isDisabled={isDisabled ? true : false}
      action="buy"
      onClose={onClose}
      onConfirm={onConfirm}
      isProcessing={isProcessing}
      isFormValid={isFormValid}
      payload={payload}
    />
  )
}
