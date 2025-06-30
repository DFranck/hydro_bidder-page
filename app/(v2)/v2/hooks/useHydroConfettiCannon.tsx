'use client'

import { useConfettiCannon } from '@v2/hooks/useConfettiCannon'

/**
 * Hydro brand colors for confetti effects.
 * These correspond to the CSS variables defined in globals.css:
 * - palette-beige: #ffe1b8
 * - palette-cyan: #00d1ff
 * - palette-blue: #0061ff
 * - palette-green: #00ffc2
 * - palette-red: #ff7b51
 */
const HYDRO_CONFETTI_COLORS = [
  '#ffe1b8',
  '#00d1ff',
  '#0061ff',
  '#00ffc2',
  '#ff7b51',
]

interface UseHydroConfettiCannonOptions {
  onComplete?: () => void
  numberOfPieces?: number
  gravity?: number
  initialVelocityY?: {
    min: number
    max: number
  }
  initialVelocityX?: number
}

/**
 * A wrapper around useConfettiCannon that automatically applies
 * Hydro brand colors. Use this instead of useConfettiCannon
 * to ensure consistent confetti colors across the app.
 */
export function useHydroConfettiCannon(
  options: UseHydroConfettiCannonOptions = {},
) {
  return useConfettiCannon({
    ...options,
    colors: HYDRO_CONFETTI_COLORS,
  })
}
