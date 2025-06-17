import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom
import { cn } from '@/lib/utils';
import { LayoutDashboard, CandlestickChart, Store, Wallet, UserCircle } from 'lucide-react'; // Example icons

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, currentPath }) => {
  const isActive = currentPath === to || (to !== "/" && currentPath.startsWith(to));
  console.log(`NavItem: ${label}, to: ${to}, currentPath: ${currentPath}, isActive: ${isActive}`);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        isActive ? "bg-gray-100 dark:bg-gray-800 text-green-600 dark:text-green-400" : "text-gray-700 dark:text-gray-300"
      )}
    >
      <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-green-500" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400")} />
      {label}
    </Link>
  );
};

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  console.log("Rendering NavigationMenu, current path:", location.pathname);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/trading", icon: CandlestickChart, label: "Trading" },
    { to: "/markets", icon: Store, label: "Markets" },
    { to: "/wallet", icon: Wallet, label: "Wallet" },
    { to: "/account", icon: UserCircle, label: "Account" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Replace with your logo component or image */}
              <span className="font-bold text-xl text-green-600 dark:text-green-400">TradeApp</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} currentPath={location.pathname} />
            ))}
          </div>
          {/* Mobile menu button could be added here */}
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;