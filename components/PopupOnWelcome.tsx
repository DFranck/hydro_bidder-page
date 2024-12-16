"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export function PopupOnWelcome() {
  const { lockups, lockedAtomIsAtCapacityGlobal } = useBackendData()
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useLocalStorage(
    "dont-show-welcome-popup-again",
    false
  )
  const shouldWelcome = !lockedAtomIsAtCapacityGlobal && lockups.length === 0

  useEffect(() => {
    if (dontShowAgain || !shouldWelcome) {
      return
    }

    setIsOpen(true)
  }, [dontShowAgain, shouldWelcome])

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <ModalWindow isOpen={isOpen} onClose={closeModal}>
      <Card
        className={`
          w-full
          max-w-2xl
        `}
      >
        <Card.Header title="Get started on Hydro" />
        <Card.Body>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Lock your staked ATOM to get voting power. The longer you lock it,
              the more power you get. You continue earning all of the Cosmos Hub
              staking rewards.
            </li>
            <li>
              Vote for a project. You can use your voting power to vote for one
              project. You can change your vote as many times as you want until
              the round ends.
            </li>
            <li>
              Collect your rewards! When the round ends, a share of the tributes
              posted by the winning projects are distributed according to your
              voting power.
            </li>
          </ol>

          <div
            className={`
              flex
              items-center
              justify-start
              gap-3
            `}
          >
            <StyledText variant="button.primary" as={Link} href="/lock-atom">
              Lock your ATOM to vote
            </StyledText>
            <StyledText
              variant="button.secondary"
              as="button"
              onClick={closeModal}
            >
              Close
            </StyledText>
            <StyledText
              className={`
                flex
                items-center
                gap-1
                whitespace-nowrap
              `}
              variant="link"
              as="a"
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Learn More</span> <Icon name="solid:arrow-up-right" />
            </StyledText>
          </div>

          <div
            className={`
              flex
              items-center
              gap-2
            `}
          >
            <StyledText
              variant="input.checkbox"
              as="input"
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setDontShowAgain(event.target.checked)
              }
            />
            <StyledText as="label" htmlFor="dontShowAgain" variant="label">
              Don&rsquo;t show me this again
            </StyledText>
          </div>
        </Card.Body>
      </Card>
    </ModalWindow>
  )
}
