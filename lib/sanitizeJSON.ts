export function sanitizeJSON(str: string): string {
  return (
    str
      // Remove comments
      .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")
      // Add quotes to unquoted keys
      .replace(
        /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
        '$1"$3":'
      )
      // Remove trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
  )
}
