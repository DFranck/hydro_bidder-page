import { useContext } from "react"
import { GlobalLockupCapacityInfo } from "./types"
import { GlobalLockupInfoContext } from "@/components/GlobalLockupInfoProvider"

export function useGlobalLockupCapacityInfo(): {
  data: GlobalLockupCapacityInfo
  isLoaded: boolean
} {
  const context = useContext(GlobalLockupInfoContext)
  if (!context) {
    throw new Error(
      "useGlobalLockupCapacityInfo must be used within a GlobalLockupInfoProvider"
    )
  }
  return context
}
