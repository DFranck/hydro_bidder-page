import { type ReactNode } from "react"

export function WordWrapper({
  words,
  sliceStart,
  sliceEnd,
  wrapper,
}: {
  words: string
  sliceStart: number
  sliceEnd?: number
  wrapper: (words: string) => ReactNode
}): ReactNode {
  const wordsArray = words.split(" ")
  const wrappedText = wordsArray.slice(sliceStart, sliceEnd).join(" ")

  const beforeText = wordsArray.slice(0, sliceStart).join(" ")
  const afterText = sliceEnd ? wordsArray.slice(sliceEnd).join(" ") : ""

  return (
    <>
      {beforeText}
      {beforeText ? " " : ""}
      {wrapper(wrappedText)}
      {afterText ? " " : ""}
      {afterText}
    </>
  )
}
