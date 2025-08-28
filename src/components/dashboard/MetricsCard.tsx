import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  variant = 'default',
  className = "" 
}: MetricsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'success': return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning': return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'danger': return 'border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10';
      default: return 'shadow-card';
    }
  };

  return (
    <Card className={`${getCardVariant()} ${className} animate-fade-in`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {trend && trendValue && (
            <Badge variant="outline" className={`${getTrendColor()} border-current`}>
              {getTrendIcon()}
              <span className="ml-1">{trendValue}</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}