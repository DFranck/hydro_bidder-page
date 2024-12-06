"use client"

// https://dev.to/tyuen/nextjs-app-router-navigation-indicator-and-the-delay-after-onclick-5aba
// Used in @/public/service-worker.js
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch(console.error)
}
