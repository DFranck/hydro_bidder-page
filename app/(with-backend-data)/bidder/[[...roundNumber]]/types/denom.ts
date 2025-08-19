import { buildDenomOptions } from "../buildDenomOptions";

export type DenomOption = ReturnType<typeof buildDenomOptions>[number]