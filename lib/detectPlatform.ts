export function detectPlatform(): {
  os: "iOS" | "Android" | "Other"
  browser: "Chrome" | "Firefox" | "Edge" | "Other"
} {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return { os: "Other", browser: "Other" }
  }

  const userAgent = navigator.userAgent.toLowerCase()

  const isAndroid = userAgent.includes("android")
  const isIOS = /iphone|ipad|ipod/.test(userAgent)

  let os: "iOS" | "Android" | "Other" = "Other"
  if (isAndroid) os = "Android"
  else if (isIOS) os = "iOS"

  let browser: "Chrome" | "Firefox" | "Edge" | "Other" = "Other"
  if (userAgent.includes("edg/")) {
    browser = "Edge"
  } else if (userAgent.includes("firefox/")) {
    browser = "Firefox"
  } else if (userAgent.includes("chrome/") && !userAgent.includes("edg/")) {
    browser = "Chrome"
  }

  return { os, browser }
}
