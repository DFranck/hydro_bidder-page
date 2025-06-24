import { useIsMobile } from "@/hooks/use-mobile"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { twMerge } from "tailwind-merge"

export function MarkdownContainer({
  className,
  content,
}: {
  className?: string
  content?: string
}) {
  const isMobile = useIsMobile(982)

  function insertSoftHyphens(content: string, maxLength = 5) {
    return content.replace(new RegExp(`\\w{${maxLength},}`, "g"), (word) =>
      word.replace(/(.{5})/g, "$1\u200B")
    )
  }

  const rawContent =
    content?.replaceAll(/\\n/g, "\n").replaceAll(/^#+/gm, "###") ?? ""

  const formattedContent = isMobile ? insertSoftHyphens(rawContent) : rawContent

  return (
    <div
      className={twMerge(
        `
          prose
          text-white
          marker:text-white
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
        `,
        className
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{formattedContent}</Markdown>
    </div>
  )
}
