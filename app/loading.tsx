import { Icon } from "@/components/Icon"

export default function LoadingState() {
  return (
    <div
      className="
        fixed
        inset-0
        flex
        items-center
        justify-center
        bg-palette-text
        text-2xl
        text-white
      "
    >
      <div className="animate-spin">
        <Icon name="solid:loader" />
      </div>
    </div>
  )
}
