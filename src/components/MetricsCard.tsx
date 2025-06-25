
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
      case 'up': return 'text-emerald-600 bg-emerald-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="metric-card group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${getTrendColor()}`}>
            <TrendIcon className="h-3 w-3" />
            <span className="text-xs font-semibold">
              {formatChange(change)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
