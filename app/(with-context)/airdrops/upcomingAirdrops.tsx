export interface UpcomingAirdrop {
  projectName: string
  projectDetails: string
  isConfirmed: boolean
  steps: string[]
  action: CellContentDescriptor
}

export type CellContentDescriptor =
  | ButtonCellContentDescriptor
  | TextCellContentDescriptor

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

export const upcomingAirdrops: UpcomingAirdrop[] = [
  {
    projectName: "Elys",
    projectDetails: `Text with **markdown** so [this](https://www.google.com) is a link.`,
    isConfirmed: true, // or false
    steps: ["Locked ATOM in Round 1"],
    action: {
      type: "button",
      label: "Eligibility Button",
      disabled: true,
      href: "https://www.google.com",
    },
  },
]
