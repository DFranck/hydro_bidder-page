"use server"

import { MaxUserCanLockResponse } from "./types"

const GET_MAX_USER_CAN_LOCK_ENDPOINT = "http://64.227.20.77:3000/get_maximum"

export async function getMaxUserCanLock(address: string) {
  if (!address) {
    return
  }
  try {
    const response = await fetch(
      `${GET_MAX_USER_CAN_LOCK_ENDPOINT}/${address}`
    ).then((res) => res.json())
    return response as MaxUserCanLockResponse
  } catch (error) {
    console.error(error)
  }
}
