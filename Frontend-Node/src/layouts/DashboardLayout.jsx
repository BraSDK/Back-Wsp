// src/layouts/DashboardLayout.jsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />

          <h1 className="text-2xl font-semibold">Panel Administrativo</h1>
        </header>

        <main className="p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
