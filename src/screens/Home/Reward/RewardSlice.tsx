export interface Voucher {
  id: number;
  code: string;
  value: string;
  date: string;
  amount: string;
  expired: boolean;
  status: "active" | "expired" | "used" | string;
}

export interface HistoryItem {
  id: number;
  action?: string;
  item?: string;
  date: string;
  points: string;
  balance: number;
}