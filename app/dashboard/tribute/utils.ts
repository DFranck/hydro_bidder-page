import { totalEarnedTribute } from "./data";

export const total = totalEarnedTribute.reduce((sum, item) => sum + item.tributeAmount, 0);
export const formatAmount = (amount: number) => {
    const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return amount > 0 ? `+${formattedAmount}` : formattedAmount;
  };