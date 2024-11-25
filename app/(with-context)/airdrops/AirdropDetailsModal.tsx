"use client"

import { Card } from "@/components/Card"
import { Icon } from "@/components/Icon"
import { ModalWindow } from "@/components/ModalWindow"
import { StyledText } from "@/components/StyledText"
import { Toasts } from "@/components/Toasts"
import Link from "next/link"
import { ChangeEvent, useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export function AirdropDetailsModal() {
  const [dontShowAirdropModal, setDontShowAirdropModal] = useLocalStorage(
    "dont-show-airdrops-modal",
    false
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (dontShowAirdropModal) {
      return
    }

    setIsOpen(true)
  }, [dontShowAirdropModal])

  const handleClose = () => setIsOpen(false)

  return (
    <ModalWindow isOpen={isOpen} onClose={handleClose}>
      <Card>
        <Card.Header>About Airdrops for Hydro Users</Card.Header>

        <Card.Body>
          <div>
            Hydro participants are some of the ecosystem&apos;s most active and
            engaged users, and they have the ability to vote on liquidity
            deployments throughout it. As a result, many projects see value in
            airdropping a portion of their token supply specifically to Hydro
            lockers.
          </div>
          <div>
            These are projects that have publicly shared their intention to
            airdrop to Hydro users, and is updated regularly by the Hydro team.
          </div>
        </Card.Body>

        <Card.Footer className="justify-between">
          <StyledText
            variant="button.primary"
            as="button"
            onClick={handleClose}
          >
            Close
          </StyledText>

          <label className="flex items-center gap-2">
            <StyledText
              as="input"
              type="checkbox"
              variant="input.checkbox"
              checked={dontShowAirdropModal}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setDontShowAirdropModal(event.target.checked)
              }
            />
            <StyledText variant="label">Don&rsquo;t show this again</StyledText>
          </label>
        </Card.Footer>

        <Card.Body>
          <Toasts.Toast
            icon="solid:parachute-box"
            isDismissible={false}
            variant="info"
          >
            Are you a project planning an airdrop? We&apos;re here to help.{" "}
            <StyledText
              className="inline-flex items-center gap-1"
              as={Link}
              variant="link"
              href="https://calendly.com/actional/hydro"
              target="_blank"
            >
              <span>Get in touch with us here</span>
              <Icon name="arrow-up-right-from-square" />
            </StyledText>
            .
          </Toasts.Toast>
        </Card.Body>
      </Card>
    </ModalWindow>
  )
}
