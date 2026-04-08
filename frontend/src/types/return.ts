import type { BaseQuery } from "./baseQuery";
import type { Borrow } from "./borrow";

export interface Return {
  id: number;
  borrow: Borrow;
  returnDate: string;
  borrowerNote: string | null;
  fine: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  borrowerNote: string | null;
}

export interface ReturnQuery extends BaseQuery {
  startDate?: string;
  endDate?: string;
}

export interface ReturnCard {
  totalReturn: number;
  totalOverdue: number;
}
