export function getEnvironmentVariable(variableName: string): string
export function getEnvironmentVariable(
  variableName: string,
  options: { allowNull?: true }
): string | null
export function getEnvironmentVariable(
  variableName: string,
  options?: { allowNull?: boolean }
): string | null {
  const allowNull = options?.allowNull ?? false
  let value: string | null = null

  try {
    value = process.env[variableName] ?? Netlify?.env.get(variableName) ?? null

    if (!allowNull && value === null) {
      throw new Error(
        `Required environment variable "${variableName}" is missing`
      )
    }

    return value
  } catch {
    return allowNull ? null : ""
  }
}
