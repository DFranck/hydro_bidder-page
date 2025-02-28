"use client"

import { BidTribute } from "@/components/BidTribute"
import { BlurryBackdropBox } from "@/components/BlurryBackdropBox"
import { Card } from "@/components/Card"
import { ConditionalWrapper } from "@/components/ConditionalWrapper"
import { Confetti } from "@/components/Confetti"
import { ContentContainer } from "@/components/ContentContainer"
import { EmptyBox } from "@/components/EmptyBox"
import { Icon } from "@/components/Icon"
import { InvisibleLink } from "@/components/InvisibleLink"
import { ModalWindow } from "@/components/ModalWindow"
import { StatCards } from "@/components/StatCards"
import { StyledTable } from "@/components/StyledTable"
import { ColumnObject } from "@/components/StyledTable/types"
import { StyledText } from "@/components/StyledText"
import { toastMessages } from "@/components/ToastMessages"
import { useToasts } from "@/components/Toasts"
import { Tooltip } from "@/components/Tooltip"
import {
  rewardsTotalTributeColumnTooltip,
  rewardsYourTributeColumnTooltip,
  rewardsYourTributeTooltip,
} from "@/components/ToolTips"
import { executeWalletClaimRewards } from "@/contract-apis/executeWalletClaimRewards"
import { SanitizedTokenBasedTribute } from "@/contract-apis/fetchBackendDataBeforeWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { formatAmount } from "@/lib/formatAmount"
import { useCreateSkipClientMemo, getAddress } from "@/lib/skipApi"
import { revalidateTag } from "@/lib/revalidateTag"
import { useChain } from "@cosmos-kit/react"
import keyBy from "lodash/keyBy"
import sumBy from "lodash/sumBy"
import Image from "next/image"
import { MouseEvent, useMemo, useState } from "react"
import { RouteResponse } from "@skip-go/client"
import {
  assets as hubAssets,
  chain as hubChain,
} from "chain-registry/mainnet/cosmoshub"
import {
  assets as neutronAssets,
  chain as neutronChain,
} from "chain-registry/mainnet/neutron"

type ConvertStatusMessage = {
  label: string
  value: string
  isLink: boolean
}

export default function RewardsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [skipApiRoute, setSkipApiRoute] = useState<RouteResponse | null>(null)
  const [convertStatusMessage, setConvertStatusMessage] =
    useState<ConvertStatusMessage | null>(null)
  const [claimType, setClaimType] = useState<"native" | "convert">("native")
  const [isCelebrating, setIsCelebrating] = useState(false)
  const { setToasts } = useToasts()
  const {
    getOfflineSigner,
    getRpcEndpoint,
    getSigningCosmWasmClient,
    chain: { chain_id: neutronChainId, pretty_name: neutronChainName },
  } = useChain("neutron")
  const {
    chain: { chain_id: cosmosHubChainId, pretty_name: cosmosChainName },
    address: cosmosHubAddress,
  } = useChain("cosmoshub")

  const skipClient = useCreateSkipClientMemo(
    getOfflineSigner,
    getRpcEndpoint,
    neutronChainId
  )

  const {
    address,
    bidDescriptionsByBidId,
    bids,
    bidsById,
    claimsHistorical,
    claimsOutstanding,
    currentRoundId,
    atomPrice,
    votes,
  } = useBackendData()
  const votesFromPreviousRounds = votes.filter(
    (vote) => bidsById[vote.bidId]?.roundId < currentRoundId
  )
  const bidsToRender = bids.filter(
    (bid) =>
      votesFromPreviousRounds.some((vote) => vote.bidId === bid.id) && // user voted
      bid.roundId < currentRoundId && // previous rounds
      bid.tributes.some((t) => t.isTokenBased) // has token-based tribute
  )
  const tributesById = keyBy(
    bidsToRender.flatMap((bid) => bid.tributes),
    "id"
  )

  // "Claim" button sets selection and triggers confirmation modal
  const [selection, setSelection] = useState<{
    tributeId: number
  } | null>(null)
  const selectedTribute = selection
    ? (tributesById[selection.tributeId] as SanitizedTokenBasedTribute)
    : null
  const selectedBid =
    selection && selectedTribute
      ? bidsById[tributesById[selection.tributeId].bidId]
      : null

  const srcTokenImgUrl = useMemo(() => {
    if (!selectedTribute) return
    const tributeAsset = neutronAssets.assets.find(
      (x) => x.base === selectedTribute.denomOriginal
    )
    if (!tributeAsset) return
    return tributeAsset.logo_URIs?.svg
  }, [selectedTribute])

  const destTokenImgUrl = useMemo(() => {
    const atomAsset = hubAssets.assets.find(
      (x) => x.base === process.env.NEXT_PUBLIC_ATOM_DENOM
    )
    if (!atomAsset) return
    return atomAsset.logo_URIs?.svg
  }, [])

  const srcAddressUrl = useMemo(() => {
    if (!neutronChain.explorers) return
    const srcExplorer = neutronChain.explorers.find(
      (x) => x.kind?.toLocaleLowerCase() === "mintscan"
    )
    if (!srcExplorer || !srcExplorer.account_page) return
    return srcExplorer.account_page?.replace("${accountAddress}", address)
  }, [address])

  const destAddressUrl = useMemo(() => {
    if (!hubChain.explorers) return
    const destExplorer = hubChain.explorers.find(
      (x) => x.kind?.toLocaleLowerCase() === "mintscan"
    )
    if (!destExplorer || !destExplorer.account_page || !cosmosHubAddress) return
    return destExplorer.account_page.replace(
      "${accountAddress}",
      cosmosHubAddress
    )
  }, [cosmosHubAddress])

  // Bids can have multiple tributes, so this turns each into a row
  const rows = bidsToRender
    .map((bid) => {
      const bidUrl = `/bids/${bid.id}`
      const bidDescriptionFromGithub = bidDescriptionsByBidId[bid.id]
      const { projectLogoUrl, projectName, title } = bidDescriptionFromGithub
      const tokenBasedTributes = bid.tributes.filter(
        (tribute) => tribute.isTokenBased
      )

      return tokenBasedTributes.map((tribute) => {
        const findClaimForBid = (claim: (typeof claimsOutstanding)[number]) =>
          claim.bidId === bid.id &&
          claim.tributeId === tribute.id &&
          claim.roundId === bid.roundId &&
          claim.trancheId === bid.trancheId
        const matchingOutstandingClaim = claimsOutstanding.find(findClaimForBid)
        const matchingHistoricalClaim = claimsHistorical.find(findClaimForBid)
        const matchingClaim =
          matchingOutstandingClaim ?? matchingHistoricalClaim
        const matchingClaimAmount = matchingClaim?.amount
        const rewardsInUsd = matchingClaimAmount?.valueUsd ?? 0
        const totalDeployedFunds = sumBy(
          bid.liquidityDeployment?.deployedFunds,
          "amount"
        )
        const canClaim = Boolean(matchingOutstandingClaim)
        const isClaimed = Boolean(matchingHistoricalClaim)
        const hasDeployment = Boolean(bid.liquidityDeployment)
        const isFunded = hasDeployment && totalDeployedFunds > 0
        const isRefundable = hasDeployment && totalDeployedFunds === 0

        return {
          _bid: bid,

          _tribute: tribute,

          roundNumber: (
            <InvisibleLink href={bidUrl}>{bid.roundId + 1}</InvisibleLink>
          ),

          bidTitleAndProjectName: (
            <InvisibleLink href={bidUrl}>
              <div className="flex items-center gap-6">
                {projectLogoUrl ? (
                  <div className="relative size-12">
                    <Image
                      className="object-contain"
                      src={projectLogoUrl}
                      alt={projectName}
                      fill={true}
                    />
                  </div>
                ) : null}
                <div className="flex flex-col">
                  <StyledText variant="h4">{title}</StyledText>
                  <StyledText variant="footnote">{projectName}</StyledText>
                </div>
              </div>
            </InvisibleLink>
          ),

          totalTribute: (
            <InvisibleLink href={bidUrl}>
              <BidTribute bidId={bid.id} textAlign="right" />
            </InvisibleLink>
          ),

          yourTribute: (
            <InvisibleLink href={bidUrl}>
              {!matchingClaimAmount ? (
                <div>&ndash;</div>
              ) : (
                <ConditionalWrapper
                  condition={rewardsInUsd > 0}
                  wrapper={(children) => (
                    <Tooltip tipContents={rewardsYourTributeTooltip}>
                      <div>{children}</div>
                      <StyledText variant="footnote">
                        (
                        {amountToUSDString(rewardsInUsd, {
                          appendUsd: false,
                          numberOfDecimals: 2,
                          removeTrailingZeros: true,
                        })}{" "}
                        <Icon name="circle-info" />)
                      </StyledText>
                    </Tooltip>
                  )}
                >
                  {matchingClaimAmount?.printableAmount.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits: 3,
                      trailingZeroDisplay: "stripIfInteger",
                    }
                  )}
                  &nbsp;
                  {matchingClaimAmount?.humanReadableDenom?.slice(0, 12) ??
                    tribute.denom?.slice(0, 12)}
                </ConditionalWrapper>
              )}
            </InvisibleLink>
          ),

          claimStatus: (
            <InvisibleLink href={bidUrl}>
              <div className="flex items-center justify-end gap-2">
                {canClaim ? (
                  <StyledText
                    as="button"
                    variant="button.primary.small"
                    onClick={() =>
                      setSelection({
                        tributeId: tribute.id,
                      })
                    }
                  >
                    Claim
                  </StyledText>
                ) : isClaimed ? (
                  <div className="flex items-center gap-1">
                    Claimed <Icon name="check" />
                  </div>
                ) : isRefundable ? (
                  <>Refundable</>
                ) : !hasDeployment ? (
                  <div className="flex items-center gap-1">
                    Pending Deployment <Icon name="clock" />
                  </div>
                ) : isFunded ? (
                  <div className="flex items-center gap-1">None</div>
                ) : null}
              </div>
            </InvisibleLink>
          ),
        }
      })
    })
    .flat()

  type Row = (typeof rows)[number]

  const columns: ColumnObject<Row, keyof Row>[] = [
    {
      key: "roundNumber",
      label: "Round",
      textAlign: "center",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: () => 1,
    },
    {
      key: "bidTitleAndProjectName",
      label: "Bid Title / Project Name",
      isSortable: true,
      propsForCells: {
        className: "relative",
      },
      customValueGetter: (row) => row._bid.title,
    },
    {
      key: "totalTribute",
      label: (
        <Tooltip tipContents={rewardsTotalTributeColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Total Tribute</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "center",
      isSortable: true,
      propsForCells: {
        className: "relative whitespace-nowrap",
      },
      customValueGetter: (row) =>
        row._bid.tributes
          .map((t) => t.denom)
          .sort()
          .join(", "),
    },
    {
      key: "yourTribute",
      label: (
        <Tooltip tipContents={rewardsYourTributeColumnTooltip}>
          <div className="flex items-center gap-1">
            <span>Your Tribute</span>
            <Icon name="circle-info" />
          </div>
        </Tooltip>
      ),
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
      isSortable: true,
      customValueGetter: (row) => sumBy(row._bid.tributes, "valueUsd"),
    },
    {
      key: "claimStatus",
      label: "Claim Status",
      textAlign: "right",
      propsForCells: {
        className: "whitespace-nowrap",
      },
    },
  ]

  async function claimSucceeded() {
    await revalidateTag("backendData")
    setSelection(null)
    setIsCelebrating(true)
    setSkipApiRoute(null)
    setConvertStatusMessage(null)
    setToasts([toastMessages.claimingRewardsSuccess])
  }

  async function handleClickConvertToAtom(
    event?: MouseEvent<HTMLButtonElement>
  ) {
    event?.preventDefault()
    if (!skipApiRoute) return

    setIsLoading(true)
    const userAddresses = await Promise.all(
      skipApiRoute.requiredChainAddresses.map(async (chainID) => ({
        chainID,
        address: await getAddress(chainID),
      }))
    )

    try {
      await skipClient.executeRoute({
        route: skipApiRoute,
        userAddresses,
        onTransactionCompleted: async () => {
          setConvertStatusMessage({
            label: "Transaction completed",
            value: "",
            isLink: false,
          })
          await claimSucceeded()
        },
        onTransactionTracked: async ({ explorerLink }) => {
          setConvertStatusMessage({
            label: "Transaction can be tracked via:",
            value: explorerLink,
            isLink: true,
          })
        },
        onTransactionSigned: async ({ chainID }) => {
          setConvertStatusMessage({
            label: "Transaction signed with chain ID:",
            value: chainID,
            isLink: false,
          })
        },
        onValidateGasBalance: async ({ status }) => {
          setConvertStatusMessage({
            label: "Validating gas balance, status:",
            value: status,
            isLink: false,
          })
        },
      })

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      setSelection(null)
      setSkipApiRoute(null)
      setConvertStatusMessage(null)
      setClaimType("native")
    }
  }

  function handleClickCloseClaimRewardsModal(
    event?: MouseEvent<HTMLButtonElement>
  ) {
    event?.preventDefault()
    setSelection(null)
    setSkipApiRoute(null)
    setConvertStatusMessage(null)
    setClaimType("native")
  }

  async function handleClickClaimNow(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (!selectedBid || !selectedTribute || !address) return

    try {
      setIsLoading(true)
      setToasts([toastMessages.claimingRewards])

      await executeWalletClaimRewards({
        address,
        roundId: selectedBid.roundId,
        trancheId: selectedBid.trancheId,
        tributeId: selectedTribute.id,
        getSigningCosmWasmClient,
      })

      if (claimType == "convert") {
        if (!process.env.NEXT_PUBLIC_ATOM_DENOM) return

        const route = await skipClient.route({
          amountIn: selectedTribute.amount.toString(),
          sourceAssetDenom: selectedTribute.denomOriginal,
          sourceAssetChainID: neutronChainId,
          destAssetDenom: process.env.NEXT_PUBLIC_ATOM_DENOM,
          destAssetChainID: cosmosHubChainId,
        })

        setSkipApiRoute(route)
      } else {
        await claimSucceeded()
      }

      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setToasts([toastMessages.claimingRewardsError(error as Error)])
      setIsLoading(false)
    }
  }

  return (
    <>
      <StatCards>
        <StatCards.CurrentRoundAprWallet />
        <StatCards.AllTimeAprWallet />
        <StatCards.AllTimeRewardsWallet />
      </StatCards>

      <ContentContainer className="gap-12 py-6">
        <BlurryBackdropBox>
          {rows.length > 0 ? (
            <StyledTable columns={columns} rows={rows} />
          ) : (
            <EmptyBox>
              Stake to lock. Lock to vote. Vote to earn. Connect your wallet to
              get started!
            </EmptyBox>
          )}
        </BlurryBackdropBox>
      </ContentContainer>

      <ModalWindow
        isOpen={!!selection}
        onClose={handleClickCloseClaimRewardsModal}
      >
        {skipApiRoute ? (
          <form>
            <Card>
              <Card.Header
                className="flex flex-col gap-3"
                title="Convert to ATOM"
              />
              <Card.Body className="flex flex-col gap-6">
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col items-center justify-between gap-3">
                    <StyledText
                      as="img"
                      src={srcTokenImgUrl}
                      className="h-12 w-12"
                    />
                    <Icon name="arrow-down-long" />
                    <StyledText
                      as="img"
                      src={destTokenImgUrl}
                      className="h-12 w-12"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-6">
                    <div className="flex flex-col gap-1">
                      {selectedTribute && (
                        <StyledText>
                          {formatAmount(skipApiRoute.amountIn)}&nbsp;
                          <StyledText variant="footnote">
                            {selectedTribute.denom}
                          </StyledText>
                        </StyledText>
                      )}
                      <StyledText>
                        on {neutronChainName}&nbsp;
                        <StyledText
                          as="a"
                          href={srcAddressUrl}
                          target="_blank"
                          variant="footnote"
                        >
                          {address}
                        </StyledText>
                      </StyledText>
                    </div>
                    <div className="flex flex-col gap-1">
                      <StyledText>
                        {formatAmount(skipApiRoute.amountOut)}&nbsp;
                        <StyledText variant="footnote">ATOM</StyledText>
                      </StyledText>
                      <StyledText>
                        on {cosmosChainName}&nbsp;
                        <StyledText
                          as="a"
                          variant="footnote"
                          href={destAddressUrl}
                          target="_blank"
                        >
                          {cosmosHubAddress}
                        </StyledText>
                      </StyledText>
                    </div>
                  </div>
                </div>
                {convertStatusMessage && (
                  <div className="flex flex-col">
                    <StyledText>{convertStatusMessage.label}</StyledText>
                    {convertStatusMessage.isLink ? (
                      <StyledText
                        as="a"
                        href={convertStatusMessage.value}
                        target="_blank"
                      >
                        {convertStatusMessage.value}
                      </StyledText>
                    ) : (
                      <StyledText>{convertStatusMessage.value}</StyledText>
                    )}
                  </div>
                )}
              </Card.Body>

              <Card.Footer>
                <StyledText
                  as="button"
                  variant="button.primary"
                  onClick={handleClickConvertToAtom}
                  disabled={!!convertStatusMessage || isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin text-lg">
                      <Icon name="solid:loader" />
                    </div>
                  ) : (
                    "Convert"
                  )}
                </StyledText>
              </Card.Footer>
            </Card>
          </form>
        ) : (
          <form>
            <Card>
              <Card.Header
                className="flex flex-col gap-3"
                title="Claim Your Hydro Rewards"
              >
                <StyledText>
                  <Icon name="arrow-right" className="pr-2 opacity-60" />
                  <StyledText>Select a token</StyledText>
                </StyledText>
              </Card.Header>

              <Card.Body className="flex flex-col gap-6">
                <div className="flex gap-6 px-6">
                  <StyledText
                    as="label"
                    variant="label"
                    className="flex items-center gap-2"
                  >
                    <StyledText
                      variant="input.radio"
                      as="input"
                      type="radio"
                      name="claimType"
                      checked={claimType === "native"}
                      onChange={() => setClaimType("native")}
                    />
                    {selectedTribute && (
                      <StyledText>
                        {formatAmount(selectedTribute.amount)}&nbsp;
                        <StyledText variant="footnote">
                          {selectedTribute.denom}
                        </StyledText>
                      </StyledText>
                    )}
                  </StyledText>
                  <StyledText
                    as="label"
                    variant="label"
                    className="flex items-center gap-2"
                  >
                    <StyledText
                      variant="input.radio"
                      as="input"
                      type="radio"
                      name="claimType"
                      checked={claimType === "convert"}
                      onChange={() => setClaimType("convert")}
                      disabled={!process.env.NEXT_PUBLIC_ATOM_DENOM}
                    />
                    {selectedTribute && (
                      <StyledText>
                        {formatAmount(selectedTribute.valueUsd / atomPrice)}
                        &nbsp;
                        <StyledText variant="footnote">ATOM</StyledText>
                      </StyledText>
                    )}
                  </StyledText>
                </div>
              </Card.Body>

              <Card.Footer>
                <StyledText
                  as="button"
                  variant="button.primary"
                  onClick={handleClickClaimNow}
                  disabled={isLoading}
                >
                  {}
                  {isLoading ? (
                    <div className="animate-spin text-lg">
                      <Icon name="solid:loader" />
                    </div>
                  ) : claimType === "native" ? (
                    "Claim"
                  ) : (
                    "Claim + Convert to ATOM"
                  )}
                </StyledText>

                <StyledText
                  as="button"
                  variant="button.secondary"
                  className="bg-palette-text"
                  onClick={handleClickCloseClaimRewardsModal}
                >
                  Back
                </StyledText>
              </Card.Footer>
            </Card>
          </form>
        )}
      </ModalWindow>

      <Confetti
        trigger={isCelebrating}
        onComplete={() => setIsCelebrating(false)}
      />
    </>
  )
}
