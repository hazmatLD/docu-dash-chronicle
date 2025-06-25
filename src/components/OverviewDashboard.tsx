
import { MetricsCard } from './MetricsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';

// Mock data for development
const mockMetrics = {
  totalItemsDonated: { value: '125,430', change: 12.5, trend: 'up' as const },
  estimatedFMV: { value: '$2.4M', change: 8.3, trend: 'up' as const },
  totalRevenue: { value: '$340K', change: -15.2, trend: 'down' as const },
  quarterlyProgress: { value: '67%', change: 5.8, trend: 'up' as const },
  activeRetailers: { value: '23', change: 2, trend: 'up' as const },
  nonprofitReach: { value: '89%', change: -3.1, trend: 'down' as const }
};

const mockRevenueData = [
  { week: 'W1', revenue: 85000 },
  { week: 'W2', revenue: 92000 },
  { week: 'W3', revenue: 78000 },
  { week: 'W4', revenue: 95000 },
  { week: 'W5', revenue: 88000 },
  { week: 'W6', revenue: 102000 },
];

export function OverviewDashboard() {
  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Key Metrics</h2>
          <p className="text-slate-600">Overview of your donation platform performance</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricsCard
            title="Total Items Donated"
            value={mockMetrics.totalItemsDonated.value}
            change={mockMetrics.totalItemsDonated.change}
            trend={mockMetrics.totalItemsDonated.trend}
            subtitle="vs. last week"
          />
          <MetricsCard
            title="Estimated FMV"
            value={mockMetrics.estimatedFMV.value}
            change={mockMetrics.estimatedFMV.change}
            trend={mockMetrics.estimatedFMV.trend}
            subtitle="Fair Market Value"
          />
          <MetricsCard
            title="Total Revenue"
            value={mockMetrics.totalRevenue.value}
            change={mockMetrics.totalRevenue.change}
            trend={mockMetrics.totalRevenue.trend}
            subtitle="Week-over-week"
          />
          <MetricsCard
            title="Quarterly Progress"
            value={mockMetrics.quarterlyProgress.value}
            change={mockMetrics.quarterlyProgress.change}
            trend={mockMetrics.quarterlyProgress.trend}
            subtitle="to revenue goal"
          />
          <MetricsCard
            title="Active Retailers"
            value={mockMetrics.activeRetailers.value}
            change={mockMetrics.activeRetailers.change}
            changeType="absolute"
            trend={mockMetrics.activeRetailers.trend}
            subtitle="on SaaS platform"
          />
          <MetricsCard
            title="Nonprofit Reach"
            value={mockMetrics.nonprofitReach.value}
            change={mockMetrics.nonprofitReach.change}
            trend={mockMetrics.nonprofitReach.trend}
            subtitle="receiving donations"
          />
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-slate-900">Weekly Revenue Trends</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Revenue performance over the last 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="week" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-slate-900">Smart Insights</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            AI-powered analysis of significant changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Revenue Alert: Revenue dropped 15.2% vs last week
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    This is the largest decline in the past 8 weeks
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Positive Trend: Items donated increased 12.5% week-over-week
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Highest growth rate in the past month
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Goal Progress: 67% toward quarterly revenue target
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    On track to meet Q4 goals based on current trajectory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
