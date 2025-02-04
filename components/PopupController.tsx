import { PopupOnMaxReached } from "@/components/PopupOnMaxReached"
import { PopupOnWelcome } from "@/components/PopupOnWelcome"
import { useBackendData } from "@/contract-apis/useBackendData"

export function PopupController() {
  const { lockedAtomIsAtCapacityGlobal } = useBackendData()

  return (
    <>
      {process.env.NODE_ENV !== "development" && <PopupOnMaxReached />}
      {!lockedAtomIsAtCapacityGlobal && <PopupOnWelcome />}
    </>
  )
}
