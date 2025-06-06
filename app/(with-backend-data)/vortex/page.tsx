"use client"

import { ContentContainer } from "@/components/ContentContainer"
import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { amountToUSDString } from "@/lib/amountToUSDString"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"
import { Tooltip } from "@/components/Tooltip"
import {
  atomPriceTooltip,
  liquidationBonusTooltip,
  lowerBoundTooltip,
  tokenPriceTooltip,
  upperBoundTooltip,
} from "@/components/ToolTips"
import { ConcentratedLiquidityPool } from "defi-sim"
import { twMerge } from "tailwind-merge"

type ParamKeys =
  | "tokenName"
  | "atomUsdPrice"
  | "tokenUsdPrice"
  | "atomSupplied"
  | "lowerBoundPrice"
  | "upperBoundPrice"

type ParamState = Record<ParamKeys, string>

export default function VortexPage() {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const [hasCopied, setHasCopied] = useState(false)
  const [params, setParams] = useState<ParamState>({
    tokenName: "",
    atomUsdPrice: "",
    tokenUsdPrice: "",
    atomSupplied: "",
    lowerBoundPrice: "",
    upperBoundPrice: "",
  })

  const {
    tokenName,
    tokenUsdPrice,
    atomUsdPrice,
    atomSupplied,
    lowerBoundPrice,
    upperBoundPrice,
  } = params

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setParams({
      tokenName: urlParams.get("tokenName") || "USDC",
      atomUsdPrice: urlParams.get("atomUsdPrice") || "5",
      tokenUsdPrice: urlParams.get("tokenUsdPrice") || "1",
      atomSupplied: urlParams.get("atomSupplied") || "1000",
      lowerBoundPrice: urlParams.get("lowerBoundPrice") || "0.15",
      upperBoundPrice: urlParams.get("upperBoundPrice") || "0.25",
    })
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const generateAndCopyUrl = () => {
    const { tokenName, ...rest } = params
    const numberFields: Partial<ParamState> = {}

    for (const [key, value] of Object.entries(rest)) {
      numberFields[key as ParamKeys] = Number(value).toString()
    }

    const query = new URLSearchParams({
      tokenName,
      ...numberFields,
    }).toString()

    const newUrl = `${window.location.origin}${window.location.pathname}?${query}`
    copyToClipboard(newUrl)
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  const calculateOptimalWobble = () => {
    const sqrtPrice: number = Math.sqrt(currentPrice)
    const sqrtRange: [number, number] = [
      Math.sqrt(Number(lowerBoundPrice)),
      Math.sqrt(Number(upperBoundPrice)),
    ]
    const L = Number(atomSupplied) / (sqrtPrice - sqrtRange[0])
    return L * (1 / sqrtPrice - 1 / sqrtRange[1])
  }

  const currentPrice = useMemo(
    () => Number(tokenUsdPrice) / Number(atomUsdPrice),
    [tokenUsdPrice, atomUsdPrice]
  )

  const atomInUsd = useMemo(
    () => Number(atomSupplied) * Number(atomUsdPrice),
    [atomSupplied, atomUsdPrice]
  )

  const optimalTokenValue = calculateOptimalWobble()
  const optimalTokenUsdValue = useMemo(
    () => optimalTokenValue * Number(tokenUsdPrice),
    [optimalTokenValue, tokenUsdPrice]
  )

  const totalTokenAtLowerBound = useMemo(() => {
    if (lowerBoundPrice && upperBoundPrice && currentPrice) {
      if (
        Number(lowerBoundPrice) > currentPrice ||
        Number(upperBoundPrice) < currentPrice
      ) {
        return 0
      }
      const liquidityPool = new ConcentratedLiquidityPool({
        initialPrice: currentPrice,
        feeRate: 0.0,
      })

      // Add liquidity
      const position = liquidityPool.enterPosition({
        balance: {
          x: optimalTokenValue,
          y: Number(atomSupplied),
        },
        range: [Number(lowerBoundPrice), Number(upperBoundPrice)],
      })

      // Simulate price moving to lower bound
      liquidityPool.movePrice(Number(lowerBoundPrice))

      return position.balance.x
    }

    return 0
  }, [
    currentPrice,
    optimalTokenValue,
    atomSupplied,
    lowerBoundPrice,
    upperBoundPrice,
  ])

  const atomForToken = useMemo(
    () => totalTokenAtLowerBound * Number(lowerBoundPrice),
    [totalTokenAtLowerBound, lowerBoundPrice]
  )

  const liquidationBonus = useMemo(
    () => (atomForToken / Number(atomSupplied) - 1) * 100,
    [atomForToken, atomSupplied]
  )

  return (
    <ContentContainer className="gap-6 py-6">
      <div className="flex flex-col gap-8">
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-black/30 p-6 shadow-lg backdrop-blur-lg">
            <div className="text-white/80 text-base space-y-4">
              <p>
                Vortex is Hydro&apos;s mechanism for deploying liquidity into volatile DEX pools while managing impermanent loss. It does this by combining concentrated liquidity positions with bidder-provided collateral, which may be liquidated if price moves beyond a set range.
              </p>
              <p>
                This simulation tool allows bidders to preview the parameters of a Vortex bid: token contributions from each side, tick ranges, and the collateral requirements. It&apos;s designed to help participants understand the mechanics and optimize their bids.
              </p>
              <p>The system is currently in test phase, and to encourage early experimentation, the Hydro team is offering favorable conditions:</p>
              <ul className="list-disc list-inside pl-4 space-y-2">
                <li>The yield generated by successful deployments is shared with bidders</li>
                <li>Collateral losses are partially covered by the Hydro Treasury</li>
              </ul>
              <p>
                For questions or feedback, <a href="https://t.me/cosmosp4tr1ck" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">reach out to Patrick via Telegram</a>. You can also learn more in <a href="https://x.com/HydroTeam_/status/1909965275346182627" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">this Twitter article</a>.
              </p>
            </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-black/30 p-6 shadow-lg backdrop-blur-lg">
          <StyledText as="h3" variant="h3" className="pb-4">
            Enter token prices
          </StyledText>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label" className="w-32">
              Your Token:
            </StyledText>
            <StyledText
              as="input"
              className="peer max-w-64"
              type="text"
              variant="input.text"
              name="tokenName"
              value={tokenName}
              onChange={handleChange}
            />
          </div>
          <div className="wrap flex flex-col items-start gap-8 md:flex-row md:items-end md:gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <StyledText as="label" variant="label" className="w-32">
                  ATOM Price:
                </StyledText>
                <StyledText
                  as="input"
                  className="peer max-w-64"
                  type="text"
                  variant="input.text"
                  name="atomUsdPrice"
                  value={atomUsdPrice}
                  onChange={handleChange}
                />
                <Tooltip tipContents={atomPriceTooltip}>
                  <div className="flex items-center gap-1">
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>
              </div>
              <div className="flex flex-row items-center gap-4">
                <StyledText as="label" variant="label" className="w-32">
                  <StyledText
                    as="label"
                    variant="label"
                    className="font-bold text-palette-green"
                  >
                    {tokenName || "Token"}
                  </StyledText>{" "}
                  Price:
                </StyledText>
                <StyledText
                  as="input"
                  className="peer max-w-64"
                  type="text"
                  variant="input.text"
                  name="tokenUsdPrice"
                  value={tokenUsdPrice}
                  onChange={handleChange}
                />
                <Tooltip tipContents={tokenPriceTooltip({ tokenName })}>
                  <div className="flex items-center gap-1">
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 pb-2">
              <StyledText as="label" variant="label">
                Current Price (<StyledText
                  as="label"
                  variant="label"
                  className="font-bold text-palette-green"
                >
                  {tokenName || "Token"}
                </StyledText>-ATOM):
              </StyledText>
              <StyledText as="label" variant="h4">
                {amountToUSDString(currentPrice, {
                  appendUsd: false,
                  numberOfDecimals: 5,
                  removeTrailingZeros: true,
                })}
              </StyledText>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-black/30 p-6 shadow-lg backdrop-blur-lg">
          <StyledText as="h3" variant="h3" className="pb-4">
            Set up position parameters
          </StyledText>
          <div className="wrap flex flex-col items-start gap-8 md:flex-row md:gap-16">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <StyledText as="label" variant="label" className="w-32">
                  Lower bound:
                </StyledText>
                <StyledText
                  as="input"
                  className={twMerge(
                    "peer max-w-64",
                    Number(lowerBoundPrice) > Number(currentPrice)
                      ? "border-palette-red"
                      : ""
                  )}
                  type="text"
                  variant="input.text"
                  name="lowerBoundPrice"
                  value={lowerBoundPrice}
                  onChange={handleChange}
                />
                <Tooltip tipContents={lowerBoundTooltip({ currentPrice })}>
                  <div className="flex items-center gap-1">
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>
              </div>
              <div className="flex flex-row items-center gap-4">
                <StyledText as="label" variant="label" className="w-32">
                  Upper bound:
                </StyledText>
                <StyledText
                  as="input"
                  className={twMerge(
                    "peer max-w-64",
                    Number(upperBoundPrice) < Number(currentPrice)
                      ? "border-palette-red"
                      : ""
                  )}
                  type="text"
                  variant="input.text"
                  name="upperBoundPrice"
                  value={upperBoundPrice}
                  onChange={handleChange}
                />
                <Tooltip tipContents={upperBoundTooltip({ currentPrice })}>
                  <div className="flex items-center gap-1">
                    <Icon name="circle-info" />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <StyledText as="label" variant="label">
                  ATOM provided by Hydro:
                </StyledText>
                <StyledText
                  as="input"
                  className="peer max-w-64"
                  type="text"
                  variant="input.text"
                  name="atomSupplied"
                  value={atomSupplied}
                  onChange={handleChange}
                />
                <StyledText as="label" variant="label">
                  (
                  {amountToUSDString(atomInUsd, {
                    appendUsd: false,
                    numberOfDecimals: 2,
                    removeTrailingZeros: true,
                  })}
                  )
                </StyledText>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-black/30 p-6 shadow-lg backdrop-blur-lg">
          <StyledText as="h3" variant="h3" className="pb-4">
            Results
          </StyledText>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label">
              <StyledText
                as="label"
                variant="label"
                className="font-bold text-palette-green"
              >
                {tokenName || "Token"}
              </StyledText>{" "}
              provided by bidder:
            </StyledText>
            <StyledText as="label" variant="h4">
              {optimalTokenValue.toFixed(2)}&nbsp;
              <StyledText as="label" variant="label">
                (
                {amountToUSDString(optimalTokenUsdValue, {
                  appendUsd: false,
                  numberOfDecimals: 2,
                  removeTrailingZeros: true,
                })}
                )
              </StyledText>
            </StyledText>
          </div>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label">
              Liquidation happens at:
            </StyledText>
            <StyledText as="label" variant="h4">
              {amountToUSDString(Number(lowerBoundPrice), {
                appendUsd: false,
                numberOfDecimals: 2,
                removeTrailingZeros: true,
              })}
            </StyledText>
          </div>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label">
              <StyledText
                as="label"
                variant="label"
                className="font-bold text-palette-green"
              >
                {tokenName || "Token"}
              </StyledText>{" "}
              amount in the position at the lower bound:
            </StyledText>
            <StyledText as="label" variant="h4">
              {totalTokenAtLowerBound.toFixed(2)}
            </StyledText>
          </div>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label">
              Nominal value in ATOM:
            </StyledText>
            <StyledText as="label" variant="h4">
              {atomForToken.toFixed(2)}
            </StyledText>
          </div>
          <div className="flex flex-row items-center gap-4">
            <StyledText as="label" variant="label">
              Liqudation bonus:
            </StyledText>
            <StyledText as="label" variant="h4">
              {liquidationBonus.toFixed(2)}%
            </StyledText>
            <Tooltip tipContents={liquidationBonusTooltip}>
              <div className="flex items-center gap-1">
                <Icon name="circle-info" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-black/30 p-6 shadow-lg backdrop-blur-lg">
          <StyledText as="h3" variant="h3" className="pb-4">
            FAQ
          </StyledText>
          <div className="flex flex-col gap-4">
            <StyledText as="h4" variant="h4" className="text-palette-green">
              Which price feeds does Vortex consider when deciding whether a position can be liquidated?
            </StyledText>
            <StyledText as="p" className="text-white/80">
              Vortex utilizes the price of the pool that the concentrated liquidity position is deployed in to determine whether a liquidation can occur, and the liquidation price is equal to the lower bound of the position.
            </StyledText>
          </div>
        </div>
      </div>

      <StyledText
        onClick={generateAndCopyUrl}
        as="button"
        variant="button.secondary"
        className="mt-6 w-fit"
      >
        <Icon name={hasCopied ? "solid:check" : "solid:link"} />
        <span>{hasCopied ? "Copied!" : "Copy Link"}</span>
      </StyledText>
    </ContentContainer>
  )
}
