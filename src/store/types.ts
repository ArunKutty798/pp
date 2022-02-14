export interface TradeProps {
  amount: string;
  creator: string;
  trader: string;
  title: string;
  id: string;
  status: string;
}

export interface ProgressProps {
  loading: boolean;
  type: "loading" | "success" | "error";
  message: string;
}
