import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionSelect: (transaction: Transaction) => void;
  selectedTransaction?: Transaction;
}

export function TransactionList({ transactions, onTransactionSelect, selectedTransaction }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.toAccount.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || transaction.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-danger text-danger-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'blocked': return <XCircle className="w-4 h-4 text-danger" />;
      case 'investigating': return <Clock className="w-4 h-4 text-info" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Transactions ({filteredTransactions.length})
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedTransaction?.id === transaction.id ? 'bg-primary/10 border-primary/20' : ''
              }`}
              onClick={() => onTransactionSelect(transaction)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">{transaction.id}</span>
                    {getStatusIcon(transaction.status)}
                    <Badge className={getRiskColor(transaction.riskLevel)} variant="secondary">
                      {transaction.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    {transaction.fromAccount} → {transaction.toAccount}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{transaction.description}</span>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      Risk Score: {(transaction.riskScore * 100).toFixed(1)}%
                    </div>
                    {transaction.explanations.length > 0 && (
                      <div className="text-xs text-primary">
                        {transaction.explanations.length} risk factor{transaction.explanations.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}