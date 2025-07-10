"use client"

import { detectPlatform } from "@/lib/detectPlatform"
import { Icon } from "./Icon"

const APP_STORE_LINK = "https://apps.apple.com/ng/app/keplr-wallet/id1567851089"
const PLAY_STORE_LINK =
  "https://play.google.com/store/apps/details?id=com.chainapsis.keplr"
const CHROME_WEBSTORE_LINK =
  "https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"

const FIREFOX_WEBSTORE_LINK =
  "https://addons.mozilla.org/en-US/firefox/addon/keplr/"

const EDGE_WEBSTORE_LINK =
  "https://microsoftedge.microsoft.com/addons/detail/keplr/ocodgmmffbkkeecmadcijjhkmeohinei"

const DEFAULT_WEB_LINK = CHROME_WEBSTORE_LINK

export default function PlatformRedirect() {
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /android|iphone|ipad|ipod|windows phone/i.test(navigator.userAgent)

  const handleClick = () => {
    const { os, browser } = detectPlatform()

    let url = DEFAULT_WEB_LINK

    switch (os) {
      case "iOS":
        url = APP_STORE_LINK
        break
      case "Android":
        url = PLAY_STORE_LINK
        break
      case "Other":
        switch (browser) {
          case "Chrome":
            url = CHROME_WEBSTORE_LINK
            break
          case "Firefox":
            url = FIREFOX_WEBSTORE_LINK
            break
          case "Edge":
            url = EDGE_WEBSTORE_LINK
            break
          default:
            url = DEFAULT_WEB_LINK
            break
        }
        break
    }

    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <span
      role="button"
      className="mx-1 cursor-pointer text-palette-green underline"
      onClick={handleClick}
    >
      Grab the Keplr {isMobileDevice ? "mobile app" : "extension"}{" "}
      <span className="whitespace-nowrap">
        here <Icon name="solid:arrow-up-right" />
      </span>
    </span>
  )
}
