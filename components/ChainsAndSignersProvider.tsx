import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react"
import { useChain } from "@cosmos-kit/react"
import { SigningStargateClient } from "@cosmjs/stargate"
import { ChainContext } from "@cosmos-kit/core"

interface ChainsAndSignersContextType {
  hubChain: ChainContext
  neutronChain: ChainContext
  hubSigner?: SigningStargateClient
  neutronSigner?: SigningStargateClient
}

export const ChainsAndSignersContext = createContext<
  ChainsAndSignersContextType | undefined
>(undefined)

export const ChainsAndSignersProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const hubChain = useChain("cosmoshub")
  const neutronChain = useChain("neutron")

  const [hubSigner, setHubSigner] = useState<
    SigningStargateClient | undefined
  >()
  const [neutronSigner, setNeutronSigner] = useState<
    SigningStargateClient | undefined
  >()

  useEffect(() => {
    if (hubChain.address) {
      hubChain.getSigningStargateClient().then(setHubSigner)
    }
    if (neutronChain.address) {
      neutronChain.getSigningStargateClient().then(setNeutronSigner)
    }
  }, [hubChain.address, neutronChain.address])

  return (
    <ChainsAndSignersContext.Provider
      value={{ hubChain, neutronChain, hubSigner, neutronSigner }}
    >
      {children}
    </ChainsAndSignersContext.Provider>
  )
}

export default ChainsAndSignersContext

export const useChainsAndSigners = () => {
  const context = useContext(ChainsAndSignersContext)
  if (!context) {
    throw new Error(
      "useChainsAndSigners must be used within a ChainsAndSignersProvider"
    )
  }
  return context
}
