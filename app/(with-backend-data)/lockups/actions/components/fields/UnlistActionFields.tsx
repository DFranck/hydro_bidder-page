"use client"
import { LockupActionFormProps } from "../../types"
import { LockupActionSubmit } from "../LockupActionSubmit"

export default function UnlistActionFields(
  props: LockupActionFormProps<"unlist">,
) {
  const { payload, onClose, onConfirm, isProcessing, isFormValid } = props
  return (
    <LockupActionSubmit
      action="unlist"
      onClose={onClose}
      onConfirm={onConfirm}
      isProcessing={isProcessing}
      isFormValid={isFormValid}
      payload={payload}
    />
  )
}
