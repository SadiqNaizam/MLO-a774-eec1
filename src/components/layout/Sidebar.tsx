import React from 'react';
import { cn } from '@/lib/utils';
// Example: import { ScrollArea } from "@/components/ui/scroll-area";
// Example: import NavItem components if used for navigation

interface SidebarProps {
  className?: string;
  children?: React.ReactNode; // Allow custom content within the sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ className, children }) => {
  console.log("Rendering Sidebar");

  // This is a basic sidebar structure.
  // It can be used for secondary navigation, filters, or contextual information.
  // Content should be passed as children or defined based on props/context.

  return (
    <aside className={cn("w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4", className)}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sidebar</h2>
      {/* Example placeholder for sidebar content */}
      {children ? (
        children
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Sidebar content goes here.</p>
          <p>This could be navigation links, filters, or other tools.</p>
        </div>
      )}
      {/* <ScrollArea className="h-[calc(100vh-some-offset)]"> ... </ScrollArea> */}
    </aside>
  );
};

export default Sidebar;