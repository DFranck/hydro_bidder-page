import { getDenomExponent } from "../../utils/getDenomExponent"

export function toContractAmount(val: string | number, denom: string) {
  const exp = getDenomExponent(denom)
  return Math.round(Number(val) * Math.pow(10, exp)).toString()
}
