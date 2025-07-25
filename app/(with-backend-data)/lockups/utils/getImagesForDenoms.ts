const IMAGE_NAMES = [
  "25_Piranha",
  "50_Barracuda",
  "100_Swordfish",
  "250_Shark",
  "500_Whale",
  "1000_Kraken",
]

export function getImagesWithFallback(
  denomKey: string,
): { src: string; denomKey: string }[] {
  return IMAGE_NAMES.map((name) => ({
    src: `/images/${denomKey}/${name}_${denomKey}@4x.png`,
    denomKey,
  }))
}
