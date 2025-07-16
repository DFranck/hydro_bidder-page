/**
 * Breaks long strings by inserting soft hyphens (&shy;) at regular intervals
 * @param params - Object containing the text and breakThreshold parameters
 * @param params.text - The text to process
 * @param params.breakThreshold - The threshold length for breaking strings and the interval for adding soft hyphens (default: 20)
 * @returns The text with soft hyphens inserted in long strings
 */
export function breakLongStringsEvery(
  params: {
    text: string;
    breakThreshold?: number
  }
): string {
  const { text, breakThreshold = 20 } = params

  if (!text || breakThreshold <= 0) return text

  // Split text into words and process each word
  return text.split(/(\s+)/).map(word => {
    // Only process words that are longer than breakThreshold and don't contain spaces
    if (word.length > breakThreshold && !/\s/.test(word)) {
      // Insert soft hyphens every breakThreshold characters
      const parts: string[] = []
      for (let i = 0; i < word.length; i += breakThreshold) {
        parts.push(word.slice(i, i + breakThreshold))
      }
      return parts.join('&shy;')
    }
    return word
  }).join('')
}
