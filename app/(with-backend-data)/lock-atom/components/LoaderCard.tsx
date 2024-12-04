import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"

export function LoaderCard({
  address,
  haveChains,
}: {
  address: string | null
  haveChains: boolean
}) {
  return (
    <Card>
      <Card.Header title="Connect a compatible wallet" />
      <Card.Body>
        {!address && haveChains ? (
          <p>
            In order to use Hydro, you will need to connect a compatible wallet.{" "}
            If you don&rsquo;t have a wallet,{" "}
            <a
              className="text-palette-green underline"
              href="https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Grab the Keplr extension{" "}
              <span className="whitespace-nowrap">
                here <Icon name="solid:arrow-up-right" />
              </span>
            </a>{" "}
            and connect your wallet.
          </p>
        ) : haveChains ? (
          <>
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 w-1/2 animate-pulse rounded bg-gray-300"></div>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
              <div className="h-10 animate-pulse rounded bg-gray-300"></div>
            </div>
          </>
        ) : null}
      </Card.Body>
    </Card>
  )
}
