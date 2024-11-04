import Markdown from "react-markdown"

export function MarkdownContainer({ content }: { content?: string }) {
  return (
    <div
      className="
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
      "
    >
      <Markdown>
        {content?.replaceAll(/\\n/g, "\n").replaceAll(/^#+/g, "###")}
      </Markdown>
    </div>
  )
}
