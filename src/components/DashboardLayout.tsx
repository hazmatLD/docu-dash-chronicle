
import { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Megaphone, 
  Lightbulb 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const departments = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'ops', name: 'Operations', icon: TrendingUp },
  { id: 'bd', name: 'Business Dev', icon: Briefcase },
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'product', name: 'Product', icon: Lightbulb },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeDepartment, setActiveDepartment] = useState('overview');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
        <Sidebar className="border-r-0 bg-white/70 backdrop-blur-xl">
          <SidebarHeader className="p-6 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  LiquiDonate
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Weekly Lights
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu className="space-y-1">
              {departments.map((dept) => (
                <SidebarMenuItem key={dept.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveDepartment(dept.id)}
                    isActive={activeDepartment === dept.id}
                    className={`sidebar-item ${activeDepartment === dept.id ? 'active' : ''}`}
                  >
                    <dept.icon className="h-4 w-4" />
                    <span>{dept.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/50 px-6 bg-white/60 backdrop-blur-sm">
            <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900">
                {departments.find(d => d.id === activeDepartment)?.name || 'Dashboard'}
              </h1>
              <div className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Live
              </div>
            </div>
          </header>
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
