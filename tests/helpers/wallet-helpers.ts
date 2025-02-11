import { Page } from "@playwright/test"
import { TEST_WALLET } from "../config/test-wallet"

declare global {
  interface Window {
    keplr: any
  }
}

export async function connectKeplrWallet(page: Page) {
  // Wait for Keplr to be injected
  await page.waitForFunction(() => window.keplr !== undefined)

  // Import the test wallet if not already imported
  await page.evaluate(async (mnemonic) => {
    if (!window.keplr.__TEST_ONLY__) {
      window.keplr.__TEST_ONLY__ = {}
    }
    window.keplr.__TEST_ONLY__.importMnemonic = async (mnemonic: string) => {
      // Import wallet using mnemonic
    }
    await window.keplr.__TEST_ONLY__.importMnemonic(mnemonic)
  }, TEST_WALLET.mnemonic)

  // Click connect wallet button
  await page.getByRole("button", { name: "Connect Wallet" }).click()
  await page.getByRole("button", { name: "Keplr" }).click()

  // Handle Keplr approval popup
  const popup = await page.waitForEvent("popup")
  await popup.getByRole("button", { name: "Approve" }).click()

  // Wait for connection
  await page.waitForSelector(`text=${TEST_WALLET.address?.slice(0, 6)}`)
}

export async function resetContractState(page: Page) {
  // Example of calling contract reset function
  await page.evaluate(async (contractAddress) => {
    const msg = { reset: {} }
    await window.keplr.signAndBroadcast(contractAddress, msg, "auto")
  }, process.env.TEST_CONTRACT_ADDRESS)

  // Wait for transaction to be processed
  await page.waitForTimeout(6000) // Adjust based on your chain's block time
}
