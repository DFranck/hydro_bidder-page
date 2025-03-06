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
          [&_a:hover]:text-palette-green
        `,
        className
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]}>
        {content?.replaceAll(/\\n/g, "\n").replaceAll(/^#+/g, "###")}
      </Markdown>
    </div>
  )
}
