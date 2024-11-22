export interface UpcomingAirdrop {
  projectName: string
  projectDetails: string
  isConfirmed: boolean
  steps: string[]
  check: CellContentDescriptor
  registration: CellContentDescriptor
  claim: CellContentDescriptor
}

type ButtonCellContentDescriptor = {
  type: "button"
  href: string
  disabled?: boolean
  label: string
}

type TextCellContentDescriptor = {
  type: "text"
  label: string
}

export type CellContentDescriptor =
  | ButtonCellContentDescriptor
  | TextCellContentDescriptor

export const upcomingAirdrops: UpcomingAirdrop[] = [
  {
    projectName: "Elys",
    projectDetails: `Text with **markdown** so [this](https://www.google.com) is a link.`,
    isConfirmed: true, // or false
    steps: ["Locked ATOM in Round 1"],
    check: {
      type: "button",
      label: "Eligibility Button",
      disabled: true,
      href: "https://www.google.com",
    },
    registration: {
      type: "text",
      label: "Just some text about it",
    },
    claim: {
      type: "button",
      label: "Claim Button",
      href: "https://www.google.com",
    },
  },
]
