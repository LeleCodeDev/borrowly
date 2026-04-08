import {
  Activity,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Store,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/api/useAuth";
import type { UserRole } from "../types/user";

const RoleSidebar = ({ role }: { role: UserRole }) => {
  const menuItems = {
    admin: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/admin/dashboard",
      },
      {
        title: "Users",
        icon: Users,
        url: "/admin/users",
      },
      {
        title: "Items",
        icon: Package,
        url: "/admin/items",
      },
      {
        title: "Categories",
        icon: FolderTree,
        url: "/admin/categories",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/admin/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/admin/returns",
      },
      {
        title: "Activity Log",
        icon: Activity,
        url: "/admin/logs",
      },
    ],
    borrower: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
      {
        title: "Items",
        icon: Package,
        url: "/items",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/returns",
      },
    ],
    officer: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/officer/dashboard",
      },
      {
        title: "Borrows",
        icon: FileText,
        url: "/officer/borrow-requests",
      },
      {
        title: "Returns",
        icon: RotateCcw,
        url: "/officer/returns",
      },
    ],
  };

  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-4" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Link
                to="/admin/dashboard"
                className="flex gap-3 items-center py-3"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Store className="w-7 h-7" />
                  <span className="text-xl font-bold text-primary">
                    Borrowly <span className="text-transparent">diosfo</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems[role].map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={`transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-200 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                          : "hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="w-5 h-4" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="hover:cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:bg-red-950/50 dark:hover:bg-red-950 px-4 py-2 transition-colors duration-200 flex items-center gap-2 text-base"
              tooltip="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default RoleSidebar;
