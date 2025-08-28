import { useState, useEffect } from 'react';
import { Transaction, Alert, DashboardMetrics } from '@/types/transaction';
import { generateMockTransactions, generateMockAlerts, generateMockMetrics } from '@/services/mockData';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { TransactionDetails } from '@/components/dashboard/TransactionDetails';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { useToast } from '@/hooks/use-toast';
import { Brain, Shield, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockTransactions = generateMockTransactions(100);
        const mockAlerts = generateMockAlerts();
        const mockMetrics = generateMockMetrics();
        
        setTransactions(mockTransactions);
        setAlerts(mockAlerts);
        setMetrics(mockMetrics);
        setSelectedTransaction(mockTransactions[0]);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update a transaction status or add new alert
      if (Math.random() > 0.7) {
        const newTransaction = generateMockTransactions(1)[0];
        setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]);
        
        if (newTransaction.riskLevel === 'critical' || newTransaction.riskLevel === 'high') {
          toast({
            title: "High Risk Transaction Detected",
            description: `Transaction ${newTransaction.id} flagged for review`,
            variant: "destructive",
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleTransactionAction = (id: string, action: 'approve' | 'reject' | 'investigate') => {
    setTransactions(prev => 
      prev.map(txn => 
        txn.id === id 
          ? { 
              ...txn, 
              status: action === 'approve' ? 'approved' : 
                     action === 'reject' ? 'blocked' : 'investigating' 
            }
          : txn
      )
    );

    if (selectedTransaction?.id === id) {
      setSelectedTransaction(prev => 
        prev ? { 
          ...prev, 
          status: action === 'approve' ? 'approved' : 
                 action === 'reject' ? 'blocked' : 'investigating' 
        } : null
      );
    }

    toast({
      title: `Transaction ${action === 'approve' ? 'Approved' : action === 'reject' ? 'Blocked' : 'Under Investigation'}`,
      description: `Transaction ${id} has been ${action === 'approve' ? 'approved' : action === 'reject' ? 'blocked' : 'marked for investigation'}`,
      variant: action === 'reject' ? 'destructive' : 'default',
    });
  };

  const handleAlertClick = (alert: Alert) => {
    const transaction = transactions.find(t => t.id === alert.transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
    }
    toast({
      title: "Alert Selected",
      description: `Viewing details for ${alert.title}`,
    });
  };

  const refreshData = () => {
    const mockTransactions = generateMockTransactions(100);
    const mockAlerts = generateMockAlerts();
    const mockMetrics = generateMockMetrics();
    
    setTransactions(mockTransactions);
    setAlerts(mockAlerts);
    setMetrics(mockMetrics);
    setSelectedTransaction(mockTransactions[0]);
    
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated",
    });
  };

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fraud detection system...</p>
        </div>
      </div>
    );
  }

  const flaggedCount = transactions.filter(t => t.status === 'flagged' || t.status === 'investigating').length;
  const criticalCount = transactions.filter(t => t.riskLevel === 'critical').length;
  const avgResponseTime = 4.2; // minutes

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              AI Fraud Detection System
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time transaction monitoring and risk assessment
            </p>
          </div>
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Transactions"
            value={metrics.totalTransactions}
            subtitle="Last 24 hours"
            trend="up"
            trendValue="+12%"
            variant="default"
          />
          <MetricsCard
            title="Flagged for Review"
            value={flaggedCount}
            subtitle={`${((flaggedCount / transactions.length) * 100).toFixed(1)}% of total`}
            trend="down"
            trendValue="-5%"
            variant="warning"
          />
          <MetricsCard
            title="Critical Risk"
            value={criticalCount}
            subtitle="Requires immediate attention"
            trend="neutral"
            trendValue="stable"
            variant="danger"
          />
          <MetricsCard
            title="Avg Response Time"
            value={`${avgResponseTime}m`}
            subtitle="Human review time"
            trend="down"
            trendValue="-15%"
            variant="success"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="False Positive Rate"
            value={`${(metrics.falsePositiveRate * 100).toFixed(1)}%`}
            subtitle="Model accuracy metric"
            trend="down"
            trendValue="-2%"
            variant="success"
          />
          <MetricsCard
            title="Blocked Amount"
            value={`$${(metrics.blockedAmount / 1000000).toFixed(1)}M`}
            subtitle="Potential fraud prevented"
            trend="up"
            trendValue="+23%"
            variant="success"
          />
          <MetricsCard
            title="Review Backlog"
            value={metrics.reviewBacklog}
            subtitle="Pending investigations"
            trend="down"
            trendValue="-8%"
            variant="warning"
          />
          <MetricsCard
            title="Active Alerts"
            value={alerts.filter(a => a.status === 'new').length}
            subtitle="Requiring attention"
            trend="neutral"
            trendValue="stable"
            variant="danger"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transactions */}
          <div className="lg:col-span-1">
            <TransactionList
              transactions={transactions}
              onTransactionSelect={setSelectedTransaction}
              selectedTransaction={selectedTransaction}
            />
          </div>

          {/* Middle Column - Transaction Details */}
          <div className="lg:col-span-1">
            {selectedTransaction ? (
              <TransactionDetails
                transaction={selectedTransaction}
                onApprove={(id) => handleTransactionAction(id, 'approve')}
                onReject={(id) => handleTransactionAction(id, 'reject')}
                onInvestigate={(id) => handleTransactionAction(id, 'investigate')}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a transaction to view details
              </div>
            )}
          </div>

          {/* Right Column - Alerts */}
          <div className="lg:col-span-1">
            <AlertsPanel
              alerts={alerts}
              onAlertClick={handleAlertClick}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI Model v2.1
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              98.7% Accuracy
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              12 Analysts Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}