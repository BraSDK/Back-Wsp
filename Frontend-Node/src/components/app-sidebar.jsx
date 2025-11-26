import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  
  import { Home, LogOut, User, Users as UsersIcon } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  
  export function AppSidebar() {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
    return (
      <Sidebar>
        <SidebarHeader className="px-4 py-4 font-bold text-xl">
          Mi Sistema
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                <Link to="/usuarios" className="flex items-center">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Usuarios
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
  
        <SidebarFooter className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </SidebarFooter>
      </Sidebar>
    );
  }
  