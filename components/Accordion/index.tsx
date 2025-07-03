import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Props = {
  title: string
  content: string
  type?: "single" | "multiple"
  className?: string
}

function AccordionWrapper({
  title,
  content,
  type = "single",
  className,
}: Props) {
  return (
    <Accordion type={type} collapsible>
      <AccordionItem value={title} className={className}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordionWrapper
