import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Smartphone,
  Calendar,
  DollarSign,
  TrendingUp,
  Network,
  Timer
} from "lucide-react";

interface TransactionDetailsProps {
  transaction: Transaction;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onInvestigate: (id: string) => void;
}

export function TransactionDetails({ 
  transaction, 
  onApprove, 
  onReject, 
  onInvestigate 
}: TransactionDetailsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-danger';
      case 'high': return 'text-warning';
      case 'medium': return 'text-info';
      default: return 'text-success';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'flagged': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'blocked': return <XCircle className="w-5 h-5 text-danger" />;
      case 'investigating': return <Clock className="w-5 h-5 text-info" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'velocity': return <TrendingUp className="w-4 h-4" />;
      case 'amount': return <DollarSign className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'temporal': return <Timer className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="font-mono">{transaction.id}</span>
                {getStatusIcon(transaction.status)}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTimestamp(transaction.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatAmount(transaction.amount, transaction.currency)}
              </div>
              <Badge className={`${getRiskColor(transaction.riskLevel)} border-current`} variant="outline">
                {transaction.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">From Account</h4>
              <p className="font-mono text-sm bg-muted p-2 rounded">
                {transaction.fromAccount}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">To Account</h4>
              <p className="font-mono text-sm bg-muted p-2 rounded">
                {transaction.toAccount}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm">{transaction.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Risk Score</span>
              <span className={`font-bold ${getRiskColor(transaction.riskLevel)}`}>
                {(transaction.riskScore * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={transaction.riskScore * 100} 
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Velocity</div>
              <div className="font-bold">{(transaction.features.velocityScore * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-bold">{(transaction.features.amountAnomaly * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Network</div>
              <div className="font-bold">{(transaction.features.networkRisk * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Behavior</div>
              <div className="font-bold">{(transaction.features.behaviorScore * 100).toFixed(0)}%</div>
            </div>
          </div>

          {transaction.explanations.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {transaction.explanations.map((explanation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    {getCategoryIcon(explanation.category)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{explanation.feature}</span>
                        <Badge variant="outline" className="text-xs">
                          Impact: {(explanation.impact * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {explanation.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transaction Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.metadata.location}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Device</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {transaction.metadata.deviceFingerprint}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Time Pattern</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.metadata.dayOfWeek}, {transaction.metadata.timeOfDay}
                </div>
              </div>
            </div>
            
            {transaction.metadata.merchantCategory && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.metadata.merchantCategory}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {transaction.status !== 'approved' && transaction.status !== 'blocked' && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={() => onApprove(transaction.id)}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              
              <Button 
                onClick={() => onInvestigate(transaction.id)}
                variant="outline"
              >
                <Clock className="w-4 h-4 mr-2" />
                Investigate
              </Button>
              
              <Button 
                onClick={() => onReject(transaction.id)}
                className="bg-danger hover:bg-danger/90 text-danger-foreground"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Block
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}