import { Icon } from "@/components/Icon"

export function getEligibilityIcon(meta: {
  isTiedToDeployment?: boolean
  isEligibleToChangeVote?: boolean
}) {
  if (meta.isEligibleToChangeVote)
    return {
      icon: (
        <Icon
          name="solid:circle-check"
          className="mr-3 min-w-4 text-base text-palette-green "
        />
      ),
      color: "text-palette-green",
    }
  if (meta.isTiedToDeployment)
    return {
      icon: (
        <Icon
          name="solid:lock"
          className="mr-3 min-w-4 text-base text-palette-beige "
        />
      ),
      color: "text-palette-beige",
    }
  return {
    icon: (
      <Icon
        name="solid:circle-dashed"
        className="mr-3 min-w-4 text-base text-palette-beige "
      />
    ),
    color: "text-palette-beige",
  }
}
