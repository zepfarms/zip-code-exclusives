
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Users, MapPin, FileText } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center px-2">
              <ShieldCheck className="h-6 w-6 text-brand-600" />
              <span className="ml-2 text-lg font-semibold">Admin Panel</span>
            </div>
          </SidebarHeader>
          
          <Separator />
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileText className="h-4 w-4 mr-2" /> 
                  Leads
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Users className="h-4 w-4 mr-2" /> 
                  Users
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MapPin className="h-4 w-4 mr-2" /> 
                  Territories
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="px-3 py-2">
              <span className="text-xs text-gray-500">LeadXclusive Admin v1.0.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-col flex-1 ml-0 md:ml-64">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
