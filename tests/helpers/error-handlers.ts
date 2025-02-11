import { Page } from "@playwright/test"

export async function handleWalletErrors(page: Page) {
  page.on("dialog", async (dialog) => {
    console.log(`Dialog message: ${dialog.message()}`)
    await dialog.dismiss()
  })
}
