
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import {
  BarChart,
  ClipboardList,
  Database,
  Home,
  Layers,
  Megaphone,
  Phone,
  ScrollText,
  Settings,
  ShoppingCart,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: React.FC<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarLink = ({ href, icon: Icon, children, active }: SidebarLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-amber-400 text-black"
          : "text-gray-700 hover:bg-muted"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

interface SidebarSubmenuProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
}

const SidebarSubmenu = ({ title, icon: Icon, children, active }: SidebarSubmenuProps) => {
  const [isOpen, setIsOpen] = useState(active);
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
          active
            ? "bg-amber-400 text-black"
            : "text-gray-700 hover:bg-muted"
        )}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <div className="pl-8 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const isResourcesActive = path.startsWith("/resources");

  return (
    <div className="w-56 min-h-screen border-r p-4 bg-white flex flex-col">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>

      <nav className="space-y-1">
        <SidebarLink href="/dashboard" icon={Home} active={path === "/dashboard" || path === "/"}>
          Dashboard
        </SidebarLink>
        <SidebarLink
          href="/pos"
          icon={Phone}
          active={path.startsWith("/pos")}
        >
          Point of sale
        </SidebarLink>
        <SidebarLink
          href="/orders"
          icon={ClipboardList}
          active={path.startsWith("/orders")}
        >
          All Orders
        </SidebarLink>
        <SidebarLink
          href="/reservations"
          icon={ScrollText}
          active={path.startsWith("/reservations")}
        >
          Reservations
        </SidebarLink>
        <SidebarLink
          href="/catalog"
          icon={Layers}
          active={path.startsWith("/catalog")}
        >
          Catalog
        </SidebarLink>
        <SidebarLink
          href="/inventory"
          icon={Database}
          active={path.startsWith("/inventory")}
        >
          Inventory
        </SidebarLink>
        <SidebarLink
          href="/purchase"
          icon={ShoppingCart}
          active={path.startsWith("/purchase")}
        >
          Purchase Order
        </SidebarLink>
        <SidebarLink
          href="/customers"
          icon={Users}
          active={path.startsWith("/customers")}
        >
          Customers
        </SidebarLink>
        <SidebarLink
          href="/marketing"
          icon={Megaphone}
          active={path.startsWith("/marketing")}
        >
          Marketing
        </SidebarLink>
        <SidebarLink
          href="/analytics"
          icon={BarChart}
          active={path.startsWith("/analytics")}
        >
          Analytics & Report
        </SidebarLink>
        
        <SidebarSubmenu 
          title="Manage Resources" 
          icon={Shield} 
          active={isResourcesActive}
        >
          <Link
            to="/resources/staff"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              path === "/resources/staff"
                ? "bg-amber-400 text-black"
                : "text-gray-700 hover:bg-muted"
            )}
          >
            <span>Staff Listing</span>
          </Link>
          <Link
            to="/resources/roles"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              path === "/resources/roles"
                ? "bg-amber-400 text-black"
                : "text-gray-700 hover:bg-muted"
            )}
          >
            <span>Roles & Permissions</span>
          </Link>
        </SidebarSubmenu>
        
        <SidebarLink
          href="/business-settings"
          icon={Settings}
          active={path.startsWith("/business-settings")}
        >
          Business Settings
        </SidebarLink>
      </nav>
    </div>
  );
};

export default Sidebar;
