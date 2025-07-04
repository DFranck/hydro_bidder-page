import { LockupsPageForAtom } from "./LockupsPageForAtom"
import { LockupsPageForStOsmo } from "./LockupsPageForStOsmo"

export default function LockupsPage() {
  if (process.env.NEXT_PUBLIC_VOTING_TOKEN_NAME === "stOSMO") {
    return <LockupsPageForStOsmo />
  }

  return <LockupsPageForAtom />
}
