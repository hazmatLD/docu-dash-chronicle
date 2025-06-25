
import { MetricsCard } from './MetricsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  { week: 'W1', revenue: 85000, change: 12 },
  { week: 'W2', revenue: 92000, change: 8.2 },
  { week: 'W3', revenue: 78000, change: -15.2 },
  { week: 'W4', revenue: 95000, change: 21.8 },
  { week: 'W5', revenue: 88000, change: -7.4 },
  { week: 'W6', revenue: 102000, change: 15.9 },
];

export function OverviewDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Revenue Trends</CardTitle>
          <CardDescription>Revenue performance over the last 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Insights</CardTitle>
          <CardDescription>Automated analysis of significant changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">
                ⚠️ Revenue Alert: Revenue dropped 15.2% vs last week
              </p>
              <p className="text-xs text-red-600 mt-1">
                This is the largest decline in the past 8 weeks
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                📈 Positive Trend: Items donated increased 12.5% week-over-week
              </p>
              <p className="text-xs text-green-600 mt-1">
                Highest growth rate in the past month
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                🎯 Goal Progress: 67% toward quarterly revenue target
              </p>
              <p className="text-xs text-blue-600 mt-1">
                On track to meet Q4 goals based on current trajectory
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
