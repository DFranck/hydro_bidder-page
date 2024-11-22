export interface UpcomingAirdrop {
  projectName: string
  projectDetails: string
  isConfirmed: boolean
  steps: string[]
  check: CellContent
  registration: CellContent
  claim: CellContent
}

type CellContent = { label: string } & (
  | {
      type: "button"
      href: string
      disabled?: boolean
    }
  | {
      type: "text"
      label: string
    }
)

export const upcomingAirdrops: UpcomingAirdrop[] = [
  {
    projectName: "Elys",
    projectDetails: `Text with **markdown** so [this](https://www.google.com) is a link.`,
    isConfirmed: true, // or false
    steps: ["Locked ATOM in Round 1"],
    check: {
      type: "button",
      label: "Eligibility button, disabled",
      disabled: true,
      href: "https://www.google.com",
    },
    registration: {
      type: "text",
      label: "Just some text about it",
    },
    claim: {
      type: "button",
      label: "Claim button, not disabled",
      href: "https://www.google.com",
    },
  },
]
