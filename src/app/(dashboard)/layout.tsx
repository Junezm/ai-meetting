import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/auth/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}
const Layout = ({ children }: Props) => {

  return (
    <SidebarProvider>
      <DashboardSidebar />
      {children}
    </SidebarProvider>
  )
};

export default Layout;
