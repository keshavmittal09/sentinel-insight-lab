import { Transaction, Alert, DashboardMetrics } from '@/types/transaction';

const accounts = [
  'AC001234567', 'AC002345678', 'AC003456789', 'AC004567890', 'AC005678901',
  'AC006789012', 'AC007890123', 'AC008901234', 'AC009012345', 'AC010123456'
];

const descriptions = [
  'Wire Transfer', 'ACH Payment', 'International Wire', 'Cash Deposit',
  'Card Payment', 'ATM Withdrawal', 'Check Payment', 'Online Transfer',
  'Merchant Payment', 'Cryptocurrency Exchange', 'Investment Transfer'
];

const locations = [
  'New York, NY', 'London, UK', 'Hong Kong', 'Singapore', 'Dubai, UAE',
  'Zurich, Switzerland', 'Cayman Islands', 'Panama City', 'Luxembourg'
];

function generateRandomTransaction(): Transaction {
  const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
  const amount = Math.random() * 1000000 + 1000;
  const velocityScore = Math.random();
  const amountAnomaly = Math.random();
  const timeAnomaly = Math.random();
  const locationAnomaly = Math.random() * 0.8;
  const networkRisk = Math.random() * 0.6;
  const behaviorScore = Math.random() * 0.7;
  
  // Calculate overall risk score
  const riskScore = (
    velocityScore * 0.25 +
    amountAnomaly * 0.2 +
    timeAnomaly * 0.15 +
    locationAnomaly * 0.15 +
    networkRisk * 0.15 +
    behaviorScore * 0.1
  );

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  let status: 'pending' | 'approved' | 'flagged' | 'investigating' | 'blocked';

  if (riskScore > 0.8) {
    riskLevel = 'critical';
    status = Math.random() > 0.5 ? 'blocked' : 'investigating';
  } else if (riskScore > 0.6) {
    riskLevel = 'high';
    status = Math.random() > 0.3 ? 'flagged' : 'investigating';
  } else if (riskScore > 0.4) {
    riskLevel = 'medium';
    status = Math.random() > 0.7 ? 'flagged' : 'pending';
  } else {
    riskLevel = 'low';
    status = 'approved';
  }

  const explanations = [];
  
  if (velocityScore > 0.7) {
    explanations.push({
      feature: 'Transaction Velocity',
      impact: velocityScore,
      description: 'High frequency of transactions in short time period',
      category: 'velocity' as const
    });
  }

  if (amountAnomaly > 0.6) {
    explanations.push({
      feature: 'Amount Anomaly',
      impact: amountAnomaly,
      description: 'Transaction amount significantly higher than usual pattern',
      category: 'amount' as const
    });
  }

  if (locationAnomaly > 0.5) {
    explanations.push({
      feature: 'Location Risk',
      impact: locationAnomaly,
      description: 'Transaction from high-risk jurisdiction',
      category: 'location' as const
    });
  }

  if (networkRisk > 0.4) {
    explanations.push({
      feature: 'Network Analysis',
      impact: networkRisk,
      description: 'Connected to accounts with suspicious activity',
      category: 'network' as const
    });
  }

  return {
    id: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: timestamp.toISOString(),
    amount: Math.round(amount * 100) / 100,
    currency: Math.random() > 0.8 ? 'EUR' : Math.random() > 0.6 ? 'GBP' : 'USD',
    fromAccount: accounts[Math.floor(Math.random() * accounts.length)],
    toAccount: accounts[Math.floor(Math.random() * accounts.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    riskScore: Math.round(riskScore * 1000) / 1000,
    riskLevel,
    status,
    features: {
      velocityScore: Math.round(velocityScore * 1000) / 1000,
      amountAnomaly: Math.round(amountAnomaly * 1000) / 1000,
      timeAnomaly: Math.round(timeAnomaly * 1000) / 1000,
      locationAnomaly: Math.round(locationAnomaly * 1000) / 1000,
      frequencyScore: Math.round(Math.random() * 1000) / 1000,
      networkRisk: Math.round(networkRisk * 1000) / 1000,
      behaviorScore: Math.round(behaviorScore * 1000) / 1000,
    },
    explanations,
    metadata: {
      location: locations[Math.floor(Math.random() * locations.length)],
      deviceFingerprint: `DEV${Math.random().toString(36).substr(2, 8)}`,
      merchantCategory: Math.random() > 0.5 ? 'Financial Services' : 'Retail',
      timeOfDay: timestamp.getHours() < 12 ? 'morning' : timestamp.getHours() < 18 ? 'afternoon' : 'evening',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][timestamp.getDay()]
    }
  };
}

export function generateMockTransactions(count: number = 50): Transaction[] {
  return Array.from({ length: count }, generateRandomTransaction)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateMockAlerts(): Alert[] {
  const alertTypes = ['fraud', 'aml', 'velocity', 'behavioral'] as const;
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `ALR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    title: `Suspicious ${alertTypes[Math.floor(Math.random() * alertTypes.length)]} activity detected`,
    description: 'Automated ML model flagged this transaction for manual review based on risk patterns.',
    timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000).toISOString(),
    status: Math.random() > 0.6 ? 'new' : 'investigating',
    assignedTo: Math.random() > 0.5 ? 'analyst@bank.com' : undefined
  }));
}

export function generateMockMetrics(): DashboardMetrics {
  return {
    totalTransactions: 15427,
    flaggedTransactions: 342,
    falsePositiveRate: 0.12,
    averageRiskScore: 0.23,
    alertsToday: 23,
    blockedAmount: 2847392.45,
    reviewBacklog: 18,
    responseTime: 4.2
  };
}