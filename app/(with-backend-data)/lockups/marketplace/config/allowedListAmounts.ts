export const allowedListAmounts =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? [25, 50, 100, 250, 500, 1000]
    : [0.2, 0.62, 1.3, 1.98, 2.74, 4.26]
