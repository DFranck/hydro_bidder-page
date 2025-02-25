import { BackendDataTweak } from "@/contract-apis/types"
import { expect, Page, test } from "@playwright/test"

export async function setBackendTweaks(page: Page, tweaks: BackendDataTweak[]) {
  await page.evaluate((tweaksData) => {
    window.localStorage.setItem("backendDataTweaks", JSON.stringify(tweaksData))
  }, tweaks)
}

// Commonly used tweaks
export const FAKE_WALLET_TWEAK: BackendDataTweak = {
  id: "test-tweak",
  json: {
    patchData: {
      address: "neutron1r6rv879netg009eh6ty23v57qrq29afecuehlm",
      isWalletConnected: true,
    },
  },
  label: "Fake Wallet Connected",
}

test("page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/bids")
  await expect(page.getByText("Connect Wallet")).toHaveCount(4)
  await setBackendTweaks(page, [FAKE_WALLET_TWEAK])
  await page.waitForTimeout(1000)
  await expect(page.getByText("Connect Wallet")).toHaveCount(1)
  await expect(page.getByText("Change Vote")).toHaveCount(3)
})
