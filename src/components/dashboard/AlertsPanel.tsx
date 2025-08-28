import { Alert } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp, Brain, Clock, User } from "lucide-react";

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
}

export function AlertsPanel({ alerts, onAlertClick }: AlertsPanelProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fraud': return <AlertTriangle className="w-4 h-4" />;
      case 'aml': return <Shield className="w-4 h-4" />;
      case 'velocity': return <TrendingUp className="w-4 h-4" />;
      case 'behavioral': return <Brain className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger text-danger-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-danger';
      case 'investigating': return 'text-warning';
      case 'resolved': return 'text-success';
      case 'false_positive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diff = now.getTime() - alertTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const newAlerts = alerts.filter(alert => alert.status === 'new');
  const otherAlerts = alerts.filter(alert => alert.status !== 'new');

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Active Alerts
            {newAlerts.length > 0 && (
              <Badge className="bg-danger text-danger-foreground animate-pulse-glow">
                {newAlerts.length} new
              </Badge>
            )}
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {newAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors bg-danger/5 border-l-4 border-l-danger"
              onClick={() => onAlertClick(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{alert.title}</span>
                      <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(alert.timestamp)}
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {otherAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onAlertClick(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{alert.title}</span>
                      <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(alert.timestamp)}
                        {alert.assignedTo && (
                          <>
                            <User className="w-3 h-3 ml-2" />
                            {alert.assignedTo.split('@')[0]}
                          </>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
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