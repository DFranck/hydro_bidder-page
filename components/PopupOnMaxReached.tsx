"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { HYDRO_TELEGRAM_URL } from "@/config"
import { useBackendData } from "@/contract-apis/useBackendData"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export function PopupOnMaxReached() {
  const { currentRoundId, currentRoundIsPilot, isAtMaxLockupCapacity } =
    useBackendData()
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useLocalStorage(
    "dont-show-max-reached-popup-again",
    false
  )

  useEffect(() => {
    if (dontShowAgain || !isAtMaxLockupCapacity) {
      return
    }

    setIsOpen(true)
  }, [dontShowAgain, isAtMaxLockupCapacity])

  function handleModalWindowClose() {
    setIsOpen(false)
  }

  return (
    <ModalWindow isOpen={isOpen} onClose={handleModalWindowClose}>
      <Card>
        <Card.Header>
          {currentRoundIsPilot && "Pilot "}Round {currentRoundId + 1} Lock Cap
          Reached
        </Card.Header>
        <Card.Body>
          <div className="prose prose-invert">
            <p>
              The maximum amount of ATOM that can be locked in this round has
              been reached. But things are far from over!
            </p>
            <p>
              Keep optimizing your votes to ensure they go to the most rewarding
              projects. Remember, projects may increase their tribute to attract
              more votes before the round ends, so check back often.
            </p>
            <p>Don&rsquo;t miss out on the next phase:</p>
            <ul>
              <li>
                <strong>Have a lockup?</strong> Continue optimizing your
                strategy and join our{" "}
                <StyledText
                  variant="link"
                  as={Link}
                  href={HYDRO_TELEGRAM_URL}
                  target="_blank"
                >
                  Telegram Group
                  <Icon name="solid:arrow-up-right" />
                </StyledText>{" "}
                to stay updated.
              </li>
              <li>
                <strong>No lockup yet?</strong> Join the{" "}
                <StyledText
                  variant="link"
                  as={Link}
                  href={HYDRO_TELEGRAM_URL}
                  target="_blank"
                >
                  Telegram Group
                  <Icon name="solid:arrow-up-right" />
                </StyledText>{" "}
                to be the first to know when Pilot Round {currentRoundId + 2}{" "}
                kicks off!
              </li>
            </ul>
          </div>
        </Card.Body>
        <Card.Footer className="justify-between">
          <StyledText
            variant="button.primary"
            as="button"
            onClick={handleModalWindowClose}
          >
            Close
          </StyledText>

          <label className="flex items-center gap-2">
            <StyledText
              as="input"
              type="checkbox"
              variant="input.checkbox"
              checked={dontShowAgain}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setDontShowAgain(event.target.checked)
              }
            />
            <StyledText variant="label">Don&rsquo;t show this again</StyledText>
          </label>
        </Card.Footer>
      </Card>
    </ModalWindow>
  )
}
