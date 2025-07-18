export function isTouchscreen(userAgent: string): boolean {
  // Check for mobile devices specifically
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}
