
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  changeType = 'percentage', 
  subtitle,
  trend = 'neutral'
}: MetricsCardProps) {
  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    const suffix = changeType === 'percentage' ? '%' : '';
    return `${prefix}${change}${suffix}`;
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatChange(change)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
