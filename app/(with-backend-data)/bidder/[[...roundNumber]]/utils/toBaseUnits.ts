export function isPositiveDecimalString(v: string): boolean {
  const s = (v ?? "").trim()
  return s !== "" && /^(\d+(\.\d*)?|\.\d+)$/.test(s) && Number(s) >= 0
}

/** Compare two unsigned integer strings ("0012" vs "12") */
export function gtIntStr(a: string, b: string): boolean {
  const A = (a || "0").replace(/^0+/, "") || "0"
  const B = (b || "0").replace(/^0+/, "") || "0"
  if (A.length !== B.length) return A.length > B.length
  return A > B
}

/** display -> base units (as string), using exponent */
export function toBaseUnitsStr(display: string, exp: number): string {
  const s = (display ?? "").trim().replace(",", ".")
  if (!isPositiveDecimalString(s)) return "0"
  if (exp <= 0) return s.replace(/^0+/, "") || "0"

  const [i, f = ""] = s.split(".")
  const iSafe = i === "" ? "0" : i
  const fPadded = (f + "0".repeat(exp)).slice(0, exp)
  const iClean = (iSafe || "0").replace(/^0+/, "") || "0"
  const out = iClean + fPadded
  return out.replace(/^0+/, "") || "0"
}

/** base units -> raw display (no separators), good for <input type=number> */
export function toDisplayRawFromBaseStr(base: string, exp: number): string {
  const s = (base || "0").replace(/^0+/, "") || "0"
  if (exp <= 0) return s
  if (s.length <= exp) {
    const frac = s.padStart(exp, "0").replace(/0+$/, "")
    return frac ? `0.${frac}` : "0"
  }
  const i = s.slice(0, s.length - exp)
  const f = s.slice(s.length - exp).replace(/0+$/, "")
  return f ? `${i}.${f}` : i
}
