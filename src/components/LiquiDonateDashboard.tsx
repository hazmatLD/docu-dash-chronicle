
import { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { OverviewDashboard } from './OverviewDashboard';
import { DepartmentView } from './DepartmentView';
import { PdfUpload } from './PdfUpload';

const departments = [
  { id: 'overview', name: 'Overview' },
  { id: 'upload', name: 'Upload PDFs' },
  { id: 'ops', name: 'Operations' },
  { id: 'bd', name: 'Business Development' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'product', name: 'Product' },
];

export function LiquiDonateDashboard() {
  const [activeDepartment, setActiveDepartment] = useState('overview');

  const renderContent = () => {
    if (activeDepartment === 'overview') {
      return <OverviewDashboard />;
    }
    
    if (activeDepartment === 'upload') {
      return <PdfUpload />;
    }
    
    const dept = departments.find(d => d.id === activeDepartment);
    return dept ? <DepartmentView departmentName={dept.name} /> : null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Department Navigation */}
        <div className="flex space-x-2 border-b pb-4">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDepartment(dept.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeDepartment === dept.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
        
        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
