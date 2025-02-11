import { Page } from "@playwright/test"

export async function waitForTransaction(page: Page) {
  await page.waitForTimeout(Number(process.env.TEST_CHAIN_BLOCK_TIME))
}
