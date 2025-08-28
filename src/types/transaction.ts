export interface Transaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  fromAccount: string;
  toAccount: string;
  description: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'flagged' | 'investigating' | 'blocked';
  features: TransactionFeatures;
  explanations: RiskExplanation[];
  metadata: {
    location?: string;
    deviceFingerprint?: string;
    merchantCategory?: string;
    timeOfDay: string;
    dayOfWeek: string;
  };
}

export interface TransactionFeatures {
  velocityScore: number;
  amountAnomaly: number;
  timeAnomaly: number;
  locationAnomaly: number;
  frequencyScore: number;
  networkRisk: number;
  behaviorScore: number;
}

export interface RiskExplanation {
  feature: string;
  impact: number;
  description: string;
  category: 'velocity' | 'amount' | 'behavior' | 'network' | 'temporal' | 'location';
}

export interface Alert {
  id: string;
  transactionId: string;
  type: 'fraud' | 'aml' | 'velocity' | 'behavioral';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
}

export interface DashboardMetrics {
  totalTransactions: number;
  flaggedTransactions: number;
  falsePositiveRate: number;
  averageRiskScore: number;
  alertsToday: number;
  blockedAmount: number;
  reviewBacklog: number;
  responseTime: number;
}