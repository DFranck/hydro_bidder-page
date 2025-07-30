export const allowedListAmounts =
  process.env.NODE_ENV === "development"
    ? [0.2, 0.62, 1.3, 1.98, 2.74, 4.26]
    : [25, 50, 100, 250, 500, 1000]
