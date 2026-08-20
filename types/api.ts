// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ANALYST' | 'ADMIN';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

// Industry Types
export interface Industry {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  image?: string;
  viewCount: number;
  nodeCount?: number;
  companyCount?: number;
}

export interface ChainNode {
  id: string;
  name: string;
  level: 'UPSTREAM' | 'MIDSTREAM' | 'DOWNSTREAM' | 'ALTERNATIVE';
  description: string;
  physicalProcess?: string;
  businessModel?: string;
  profitLogic?: string;
  cycle?: string;
  beneficiaries: NodeBenefit[];
  losers: NodeLoser[];
  companies: NodeCompany[];
}

export interface NodeBenefit {
  id: string;
  name: string;
  companyId?: string;
}

export interface NodeLoser {
  id: string;
  name: string;
  companyId?: string;
}

export interface NodeCompany {
  id: string;
  company: {
    id: string;
    code: string;
    name: string;
  };
}

export interface IndustryCompany {
  code: string;
  name: string;
  business: string;
  position?: string;
  advantage?: string;
}

// Company Types
export interface Company {
  id: string;
  code: string;
  name: string;
  exchange: string;
  business?: string;
  description?: string;
  logo?: string;
  viewCount: number;
  basicInfo?: CompanyBasicInfo;
  financials?: FinancialData[];
  shareholders?: Shareholder[];
  suppliers?: Supplier[];
  customers?: Customer[];
  investments?: Investment[];
  capitalEvents?: CapitalEvent[];
  priceHistory?: PriceHistory[];
}

export interface CompanyBasicInfo {
  established?: string;
  listed?: string;
  capital?: string;
  exchange?: string;
  controller?: string;
  controllerNature?: string;
  controllerBackground?: string;
  management?: string[];
}

export interface FinancialData {
  year: number;
  quarter: number;
  revenue?: number;
  netProfit?: number;
  grossMargin?: number;
  netMargin?: number;
  roe?: number;
  revenueGrowth?: number;
  profitGrowth?: number;
}

export interface Shareholder {
  name: string;
  percentage: number;
  change: 'INCREASE' | 'DECREASE' | 'UNCHANGED';
  isTop10: boolean;
  rank: number;
}

export interface Supplier {
  name: string;
  type: 'RAW_MATERIAL' | 'EQUIPMENT' | 'SERVICE';
  description?: string;
  proportion?: number;
}

export interface Customer {
  name: string;
  type: 'STRATEGIC' | 'TERMINAL' | 'DISTRIBUTOR';
  description?: string;
  proportion?: number;
}

export interface Investment {
  year: number;
  project: string;
  amount: string;
  progress: string;
  futureImpact?: string;
}

export interface CapitalEvent {
  date: string;
  type: 'BUYBACK' | 'INCREASE' | 'DECREASE' | 'DIVIDEND' | 'SPLIT';
  description: string;
  impact?: string;
}

export interface PriceHistory {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: number;
  change?: number;
  changePct?: number;
}

export interface StockQuote {
  code: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  pe?: number;
  pb?: number;
  marketCap?: number;
}

// Export Types
export interface ExportHistory {
  id: string;
  type: 'INDUSTRY' | 'COMPANY';
  title: string;
  format: 'DOCX' | 'PDF' | 'EXCEL';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileUrl?: string;
  createdAt: string;
  completedAt?: string;
}
