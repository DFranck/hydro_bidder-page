import { waitForTransaction } from "@/tests/helpers/chain-helpers"
import { expect, test } from "@playwright/test"
import {
  connectKeplrWallet,
  resetContractState,
} from "./helpers/wallet-helpers"

test.describe("Contract Interaction Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000")
    await connectKeplrWallet(page)
  })

  test("complete flow with contract interaction", async ({ page }) => {
    // Reset contract state
    await resetContractState(page)

    // Verify initial state
    const initialBalance = await page.getByTestId("user-balance").innerText()
    expect(initialBalance).toBe("0")

    // Perform user action (e.g., stake tokens)
    await page.getByRole("button", { name: "Stake" }).click()
    await page.getByRole("textbox", { name: "Amount" }).fill("100")
    await page.getByRole("button", { name: "Confirm" }).click()

    // Wait for transaction and verify
    await waitForTransaction(page)
    const newBalance = await page.getByTestId("user-balance").innerText()
    expect(newBalance).toBe("100")

    // Reload page and verify persistence
    await page.reload()
    await connectKeplrWallet(page)
    const persistedBalance = await page.getByTestId("user-balance").innerText()
    expect(persistedBalance).toBe("100")
  })
})
