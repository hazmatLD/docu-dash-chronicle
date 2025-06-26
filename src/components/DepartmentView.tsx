
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Target, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '../context/DataContext';

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

// Mock data for different departments
const mockDepartmentData = {
  operations: {
    okrs: [
      { title: 'Reduce processing time', target: 100, current: 85, unit: '% improvement' },
      { title: 'Increase automation coverage', target: 90, current: 72, unit: '% of processes' },
      { title: 'Error rate reduction', target: 95, current: 88, unit: '% reduction' }
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
  businessdevelopment: {
    okrs: [
      { title: 'New retailer onboarding', target: 25, current: 18, unit: 'retailers' },
      { title: 'Revenue per retailer', target: 15000, current: 12800, unit: '$ monthly' },
      { title: 'Retention rate', target: 95, current: 92, unit: '% retained' }
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

const getProgressColor = (current: number, target: number) => {
  const percentage = (current / target) * 100;
  if (percentage >= 90) return 'from-emerald-500 to-green-500';
  if (percentage >= 70) return 'from-orange-500 to-yellow-500';
  return 'from-red-500 to-pink-500';
};

export function DepartmentView({ departmentName }: { departmentName: string }) {
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(['Week 23']);
  const { getDepartmentData, pdfData } = useData();
  
  const departmentKey = departmentName.toLowerCase().replace(' ', '');
  const realData = getDepartmentData(departmentName);
  
  // Use real data if available, otherwise fall back to mock data
  const data = realData || (departmentKey === 'operations' || departmentKey === 'businessdevelopment' ? mockDepartmentData[departmentKey as keyof typeof mockDepartmentData] : null);
  
  const toggleWeek = (week: string) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };
  
  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">No data available for {departmentName}</p>
          <p className="text-sm text-slate-400 mt-1">Upload weekly reports to see insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Data Source Indicator */}
      {pdfData.length > 0 && realData && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">
              Data updated from uploaded PDFs for {departmentName}
            </span>
          </div>
        </div>
      )}

      {/* OKRs Section */}
      {data.okrs && (
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-slate-900">{departmentName} OKRs</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Objectives and Key Results tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.okrs.map((okr, index) => {
                const percentage = (okr.current / okr.target) * 100;
                return (
                  <div key={index} className="space-y-3 p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900">{okr.title}</h4>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          {okr.current} / {okr.target} {okr.unit}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {percentage.toFixed(1)}% complete
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r transition-all duration-500 ${getProgressColor(okr.current, okr.target)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Updates */}
      {Array.isArray(data) ? (
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-slate-900">Weekly Updates</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Highlights and lowlights timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.map((update, index) => (
                <Collapsible 
                  key={index}
                  open={expandedWeeks.includes(update.week)}
                  onOpenChange={() => toggleWeek(update.week)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-4 h-auto bg-slate-50 hover:bg-slate-100 rounded-xl border-0"
                    >
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">{update.week}</div>
                        <div className="text-sm text-slate-500">{update.date}</div>
                      </div>
                      {expandedWeeks.includes(update.week) ? 
                        <ChevronUp className="h-4 w-4 text-slate-600" /> : 
                        <ChevronDown className="h-4 w-4 text-slate-600" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-3">
                        <h5 className="font-semibold text-emerald-700 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Highlights
                        </h5>
                        <ul className="space-y-2">
                          {update.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-red-700 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Lowlights
                        </h5>
                        <ul className="space-y-2">
                          {update.lowlights.map((lowlight, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{lowlight}</span>
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
      ) : data.weeklyUpdates && (
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-slate-900">Weekly Updates</CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Highlights and lowlights timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.weeklyUpdates.map((update) => (
                <Collapsible 
                  key={update.week}
                  open={expandedWeeks.includes(update.week)}
                  onOpenChange={() => toggleWeek(update.week)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-4 h-auto bg-slate-50 hover:bg-slate-100 rounded-xl border-0"
                    >
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">{update.week}</div>
                        <div className="text-sm text-slate-500">{update.date}</div>
                      </div>
                      {expandedWeeks.includes(update.week) ? 
                        <ChevronUp className="h-4 w-4 text-slate-600" /> : 
                        <ChevronDown className="h-4 w-4 text-slate-600" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      <div className="space-y-3">
                        <h5 className="font-semibold text-emerald-700 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Highlights
                        </h5>
                        <ul className="space-y-2">
                          {update.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-semibold text-red-700 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Lowlights
                        </h5>
                        <ul className="space-y-2">
                          {update.lowlights.map((lowlight, idx) => (
                            <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{lowlight}</span>
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
      )}
    </div>
  );
}
