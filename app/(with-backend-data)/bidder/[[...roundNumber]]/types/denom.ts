import { buildDenomOptions } from "../utils/buildDenomOptions";

export type DenomOption = ReturnType<typeof buildDenomOptions>[number]