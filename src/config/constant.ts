export const FEE_RATE = 0.001425 * 0.28;
export const TRADE_TAX_RATE = 0.003;
export const BUY_TOTAL_CHARGE = 1 + FEE_RATE;
export const SELL_TOTAL_CHARGE = 1 - (FEE_RATE + TRADE_TAX_RATE);
