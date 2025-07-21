import { breakLongStringsEvery } from "@/lib/breakLongStringsEvery"
import { useEffect, useMemo, useRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { twMerge } from "tailwind-merge"

export function MarkdownContainer({
  className,
  content,
  breakThreshold = 10,
}: {
  className?: string
  content?: string
  breakThreshold?: number
}) {
  const fixedContent = useMemo(() => {
    return content?.replace(/\\n/g, "\n")
  }, [content])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && fixedContent) {
      // Apply string breaking to the rendered HTML content
      const container = containerRef.current
      const textNodes = getTextNodes(container)

      textNodes.forEach((node) => {
        if (node.textContent && node.textContent.length > breakThreshold) {
          const processedText = breakLongStringsEvery({
            text: node.textContent,
            breakThreshold,
          })
          if (processedText !== node.textContent) {
            // Replace the text node with a span that can render HTML entities
            const span = document.createElement("span")
            span.innerHTML = processedText
            node.parentNode?.replaceChild(span, node)
          }
        }
      })
    }
  }, [fixedContent, breakThreshold])

  // Helper function to get all text nodes in the container
  const getTextNodes = (element: Node): Text[] => {
    const textNodes: Text[] = []
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text)
    }

    return textNodes
  }

  return (
    <div
      ref={containerRef}
      className={twMerge(
        `
          prose
          prose-headings:text-white
          prose-h1:tracking-normal
          prose-a:font-normal
          prose-a:text-palette-green/70
          prose-strong:text-white
          prose-code:text-palette-beige
          prose-ol:text-white
          prose-li:text-white
          prose-table:border-collapse
          prose-table:overflow-hidden
          prose-table:rounded-md
          prose-table:border
          prose-thead:bg-palette-beige/10
          prose-th:border
          prose-th:px-3
          prose-th:py-1
          prose-td:border
          prose-td:px-3
          prose-td:py-1
          [&_a:hover]:text-palette-green
          max-w-[calc(100vw-2rem)]
          text-white
          marker:text-white
        `,
        className
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{fixedContent}</Markdown>
    </div>
  )
}
