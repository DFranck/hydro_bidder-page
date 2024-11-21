import { camelCase } from "lodash"

export type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
  ? `${P}${Capitalize<CamelCase<Q>>}`
  : S

export type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends Record<string, unknown>
    ? CamelCaseKeys<T[K]>
    : T[K] extends Array<Record<string, unknown>>
      ? Array<CamelCaseKeys<T[K][number]>>
      : T[K]
}

export function keysFromSnakeToCamelCase<T extends Record<string, unknown>>(
  obj: T
): CamelCaseKeys<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelCase(key),
      value && typeof value === "object"
        ? Array.isArray(value)
          ? value.map((item) =>
              typeof item === "object" && item !== null
                ? keysFromSnakeToCamelCase(item as Record<string, unknown>)
                : item
            )
          : keysFromSnakeToCamelCase(value as Record<string, unknown>)
        : value,
    ])
  ) as CamelCaseKeys<T>
}
