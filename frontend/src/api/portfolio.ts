// src/api/portfolio.ts
import axios from "axios";

const API_BASE = "https://wealthmanager-online-assignment.onrender.com/api/portfolio";

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: string;
  exchange?: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface AllocationBucket {
  value: number;
  percentage: number;
}

export interface AllocationResponse {
  bySector: Record<string, AllocationBucket>;
  byMarketCap: Record<string, AllocationBucket>;
}

export interface SummaryResponse {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  diversificationScore: number;
  riskLevel: string;
  topPerformer?: Holding;
  worstPerformer?: Holding;
}

export interface TimelinePoint {
  date: string;
  portfolio: number;
  nifty50: number;
  gold: number;
}

export interface PerformanceResponse {
  timeline: TimelinePoint[];
  returns: Record<string, Record<string, number>>;
}

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10_000,
});

export const getHoldings = async (): Promise<Holding[]> =>
  client.get<Holding[]>("/holdings").then((r) => r.data);

export const getAllocation = async (): Promise<AllocationResponse> =>
  client.get<AllocationResponse>("/allocation").then((r) => r.data);

export const getSummary = async (): Promise<SummaryResponse> =>
  client.get<SummaryResponse>("/summary").then((r) => r.data);

export const getPerformance = async (): Promise<PerformanceResponse> =>
  client.get<PerformanceResponse>("/performance").then((r) => r.data);
