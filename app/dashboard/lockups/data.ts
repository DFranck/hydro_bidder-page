import { LockEntry } from "@/app/ts_types/HydroBase.types";

export const mockMyLockups: LockEntry[] = [
    {
        funds: {
            amount: '100',
            denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
        },
        lock_start: '2024-09-01',
        lock_end: '2024-12-01',
    },
    {
        funds: {
            amount: '100',
            denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
        },
        lock_start: '2024-03-23',
        lock_end: '2024-09-23',
    },
    {
        funds: {
            amount: '100',
            denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
        },
        lock_start: '2024-04-11',
        lock_end: '2024-10-11',
    },
    {
        funds: {
            amount: '100',
            denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
        },
        lock_start: '2024-04-24',
        lock_end: '2025-10-24',
    }
];