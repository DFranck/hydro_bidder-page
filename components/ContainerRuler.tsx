export function ContainerRuler() {
  return [
    { size: 16, name: "2xs" },
    { size: 20, name: "xs" },
    { size: 24, name: "sm" },
    { size: 28, name: "md" },
    { size: 32, name: "lg" },
    { size: 36, name: "xl" },
    { size: 42, name: "2xl" },
    { size: 48, name: "3xl" },
    { size: 56, name: "4xl" },
    { size: 64, name: "5xl" },
    { size: 72, name: "6xl" },
    { size: 80, name: "7xl" },
  ].map(({ size, name }) => (
    <div
      key={size}
      className="
        fixed
        bottom-6
        left-6
        z-50
        outline-dotted
        outline-2
        outline-palette-cyan/50
      "
      style={{ height: `${size}rem`, width: `${size}rem` }}
    >
      <div
        className="
          absolute
          right-0
          top-0
          bg-black
          px-1
          text-xs
          font-bold
          text-white
        "
      >
        {name}
      </div>
    </div>
  ))
}
