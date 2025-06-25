
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
import { LayoutDashboard, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const departments = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'ops', name: 'Operations', icon: TrendingUp },
  { id: 'bd', name: 'Business Development', icon: TrendingUp },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'product', name: 'Product', icon: TrendingUp },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeDepartment, setActiveDepartment] = useState('overview');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              LiquiDonate Dashboard
            </h2>
            <p className="text-sm text-sidebar-foreground/70">
              Weekly Lights Reporting
            </p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {departments.map((dept) => (
                <SidebarMenuItem key={dept.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveDepartment(dept.id)}
                    isActive={activeDepartment === dept.id}
                    className="w-full"
                  >
                    <dept.icon className="mr-2 h-4 w-4" />
                    <span>{dept.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">
              {departments.find(d => d.id === activeDepartment)?.name || 'Dashboard'}
            </h1>
          </header>
          <div className="flex-1 space-y-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
