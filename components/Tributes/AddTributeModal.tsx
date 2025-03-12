"use client"

import { Card } from "@/components/Card"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { AugmentedBid } from "@/contract-apis/fetchBackendDataAfterWallet"
import { useBackendData } from "@/contract-apis/useBackendData"
import { useMemo, useState } from "react"

export function AddTributeModal({
  bid,
  isOpened,
  onCloseAction,
  onCloseCompleteAction,
}: {
  bid: AugmentedBid
  isOpened: boolean
  onCloseAction: () => void
  onCloseCompleteAction: (
    amount: string,
    denom: string,
    description: string
  ) => void
}) {
  const [amount, setAmount] = useState<string>("")
  const [denom, setDenom] = useState<string>("untrn")
  const [description, setDescription] = useState<string>("")
  const { assetListWithPrices } = useBackendData()

  const denomList = useMemo(
    () =>
      Object.entries(assetListWithPrices).map((asset) => ({
        name: asset[1].symbol.replace(".", " "),
        value: asset[0],
      })),
    [assetListWithPrices]
  )

  const submit = () => {
    const asset = assetListWithPrices[denom]
    const eAmount = (Number(amount) * 10 ** asset.decimals).toFixed(0)
    onCloseCompleteAction(eAmount, denom, description)
  }

  return (
    <ModalWindow
      isOpen={isOpened}
      onClose={onCloseAction}
      onCloseComplete={submit}
      className="w-[40rem]"
    >
      <Card>
        <Card.Header title={`Add Tribute to '${bid.title}'`} />
        <Card.Body>
          <form className="flex flex-col gap-6">
            <div>
              <StyledText as="label" variant="label">
                Amount:
              </StyledText>
              <div className="flex items-center gap-2">
                <StyledText
                  as="input"
                  placeholder="0.0"
                  className="w-full"
                  type="number"
                  variant="input.text"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
                <StyledText
                  as="select"
                  variant="input.text"
                  value={denom}
                  onChange={(event) => setDenom(event.target.value)}
                >
                  {denomList.map((denom) => (
                    <option key={denom.value} value={denom.value}>
                      {denom.name}
                    </option>
                  ))}
                </StyledText>
              </div>
              <StyledText as="label" variant="label">
                Description:
              </StyledText>
              <div className="flex items-center">
                <StyledText
                  as="textarea"
                  className="w-full"
                  variant="input.text"
                  value={description}
                  rows={2}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row-reverse gap-2">
              <StyledText
                as="button"
                variant="button.primary"
                type="button"
                onClick={submit}
              >
                Add
              </StyledText>
              <StyledText
                as="button"
                variant="button.secondary"
                type="button"
                onClick={onCloseAction}
              >
                Cancel
              </StyledText>
            </div>
          </form>
        </Card.Body>
      </Card>
    </ModalWindow>
  )
}
