
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OKR {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

interface WeeklyUpdate {
  week: string;
  highlights: string[];
  lowlights: string[];
  date: string;
}

interface DepartmentViewProps {
  departmentName: string;
  okrs: OKR[];
  weeklyUpdates: WeeklyUpdate[];
}

// Mock data for different departments
const mockDepartmentData = {
  ops: {
    okrs: [
      { id: '1', title: 'Reduce processing time', target: 100, current: 85, unit: '% improvement' },
      { id: '2', title: 'Increase automation coverage', target: 90, current: 72, unit: '% of processes' },
      { id: '3', title: 'Error rate reduction', target: 95, current: 88, unit: '% reduction' }
    ],
    weeklyUpdates: [
      {
        week: 'Week 23',
        date: '2024-06-17',
        highlights: ['Automated 3 new donation processing workflows', 'Reduced manual errors by 15%'],
        lowlights: ['System downtime affected 2 retailers', 'Training delayed for new hires']
      },
      {
        week: 'Week 22',
        date: '2024-06-10',
        highlights: ['Launched new dashboard for retailers', 'Improved API response time by 30%'],
        lowlights: ['Integration issues with 1 major retailer', 'Staff shortage in QA team']
      }
    ]
  },
  bd: {
    okrs: [
      { id: '1', title: 'New retailer onboarding', target: 25, current: 18, unit: 'retailers' },
      { id: '2', title: 'Revenue per retailer', target: 15000, current: 12800, unit: '$ monthly' },
      { id: '3', title: 'Retention rate', target: 95, current: 92, unit: '% retained' }
    ],
    weeklyUpdates: [
      {
        week: 'Week 23',
        date: '2024-06-17',
        highlights: ['Signed 2 new major retailers', 'Closed $50K enterprise deal'],
        lowlights: ['Lost 1 mid-tier client to competitor', 'Delayed contract renewal with key partner']
      }
    ]
  }
};

export function DepartmentView({ departmentName }: { departmentName: string }) {
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(['Week 23']);
  
  const departmentKey = departmentName.toLowerCase().replace(' ', '').replace('business development', 'bd');
  const data = mockDepartmentData[departmentKey as keyof typeof mockDepartmentData];
  
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available for {departmentName}</p>
      </div>
    );
  }

  const toggleWeek = (week: string) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* OKRs Section */}
      <Card>
        <CardHeader>
          <CardTitle>{departmentName} OKRs</CardTitle>
          <CardDescription>Objectives and Key Results tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.okrs.map((okr) => {
              const percentage = (okr.current / okr.target) * 100;
              return (
                <div key={okr.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{okr.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {okr.current} / {okr.target} {okr.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(okr.current, okr.target)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {percentage.toFixed(1)}% complete
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Updates</CardTitle>
          <CardDescription>Highlights and lowlights timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.weeklyUpdates.map((update) => (
              <Collapsible 
                key={update.week}
                open={expandedWeeks.includes(update.week)}
                onOpenChange={() => toggleWeek(update.week)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                    <div className="text-left">
                      <div className="font-medium">{update.week}</div>
                      <div className="text-sm text-muted-foreground">{update.date}</div>
                    </div>
                    {expandedWeeks.includes(update.week) ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-700 mb-2">Highlights</h5>
                      <ul className="space-y-1">
                        {update.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-red-700 mb-2">Lowlights</h5>
                      <ul className="space-y-1">
                        {update.lowlights.map((lowlight, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {lowlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
