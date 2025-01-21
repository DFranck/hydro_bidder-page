import { type ReactNode } from "react"

export function preventOrphans({
  text,
  numWordsToWrap,
  append,
}: {
  text: string
  numWordsToWrap: number
  append?: ReactNode
}): ReactNode {
  const validNumWordsToWrap = Math.max(numWordsToWrap, 1)
  const words = text.split(" ")
  const mainText = words.slice(0, -validNumWordsToWrap).join(" ")
  const wrappedText = words.slice(-validNumWordsToWrap).join(" ")

  return (
    <>
      {mainText}
      {mainText ? " " : ""}
      <span className="whitespace-nowrap">
        {wrappedText}
        {!!append && <> {append}</>}
      </span>
    </>
  )
}
