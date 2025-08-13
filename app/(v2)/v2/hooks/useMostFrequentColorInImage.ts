import { useCallback, useEffect, useState } from 'react'

// Made this hook to extract a logo's most prominent color so we could fully
// color their bid page to match their brand.

interface UseMostFrequentColorInImageOptions {
  url: string
  fallbackColor?: string
  ignoreGreyscale?: boolean
}

interface ColorCount {
  color: string
  count: number
}

export function useMostFrequentColorInImage({
  url,
  fallbackColor = '',
  ignoreGreyscale = true,
}: UseMostFrequentColorInImageOptions) {
  const [extractedColor, setExtractedColor] = useState<string>(fallbackColor)

  const extractProminentColor = useCallback(async () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()

    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.crossOrigin = 'anonymous'
        img.src = url
      })

      const maxSize = 100
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      const scaledWidth = Math.floor(img.width * scale)
      const scaledHeight = Math.floor(img.height * scale)

      canvas.width = scaledWidth
      canvas.height = scaledHeight

      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

      const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight)
      const data = imageData.data

      const colorMap = new Map<string, number>()

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        if (a < 128) continue

        const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        colorMap.set(color, (colorMap.get(color) || 0) + 1)
      }

      const sortedColors: ColorCount[] = Array.from(colorMap.entries())
        .map(([color, count]) => ({ color, count }))
        .sort((a, b) => b.count - a.count)

      const isGrayscale = (color: string) => {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        return (
          Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10
        )
      }

      let selectedColor = fallbackColor

      if (ignoreGreyscale) {
        const nonGrayscaleColors = sortedColors.filter(
          (color) => !isGrayscale(color.color),
        )
        if (nonGrayscaleColors.length > 0) {
          selectedColor = nonGrayscaleColors[0].color
        }
      } else {
        if (sortedColors.length > 0) {
          selectedColor = sortedColors[0].color
        }
      }

      if (selectedColor !== extractedColor) {
        setExtractedColor(selectedColor)
      }
    } catch (error) {
      console.warn('Failed to extract color from image:', error)
      setExtractedColor(fallbackColor)
    }
  }, [url, fallbackColor, extractedColor, ignoreGreyscale])

  useEffect(() => {
    extractProminentColor()
  }, [extractProminentColor])

  return extractedColor
}
