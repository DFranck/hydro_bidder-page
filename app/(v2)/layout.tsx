import { DummyDataProviderServer } from "@/app/(v2)/v2/dummy-data/DummyDataProviderServer"
import { ThemeColor } from "@/components/ThemeColor"

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <DummyDataProviderServer>
      <ThemeColor themeColor="var(--color-palette-text)" />
      {children}
    </DummyDataProviderServer>
  )
}
