"use server"

import { MaxUserCanLockResponse } from "./types"

const GET_MAX_USER_CAN_LOCK_ENDPOINT =
  "https://hydro-deployment-tracking-2fitd.ondigitalocean.app/maxUserCanLock"

export async function getMaxUserCanLock(address: string) {
  try {
    // const response = await fetch(
    //   `${GET_MAX_USER_CAN_LOCK_ENDPOINT}?address=${address}`
    // ).then((res) => res.json())
    // return response as MaxUserCanLockResponse
    return Promise.resolve({ amount: "1000000" } as MaxUserCanLockResponse)
  } catch (error) {
    console.error(error)
  }
}
