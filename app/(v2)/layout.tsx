import { DummyDataProvider } from "@/app/(v2)/v2/useDummyData"
import { ThemeColor } from "@/components/ThemeColor"

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <DummyDataProvider>
      <ThemeColor themeColor="var(--color-palette-text)" />
      {children}
    </DummyDataProvider>
  )
}
