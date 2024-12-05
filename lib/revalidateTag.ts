"use server"

import { revalidateTag as revalidate } from "next/cache"

export async function revalidateTag(name: string) {
  revalidate(name)
}
