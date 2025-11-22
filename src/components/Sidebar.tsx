import { NavLink } from './NavLink';
import {
  LayoutDashboard,
  Package,
  FileText,
  TruckIcon,
  ArrowLeftRight,
  ClipboardList,
  History,
  Warehouse,
  Settings,
  FolderTree,
  Ruler,
  Users,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  {
    name: 'Operations',
    icon: ClipboardList,
    children: [
      { name: 'Receipts', href: '/operations/receipts', icon: FileText },
      { name: 'Deliveries', href: '/operations/deliveries', icon: TruckIcon },
      { name: 'Transfers', href: '/operations/transfers', icon: ArrowLeftRight },
      { name: 'Adjustments', href: '/operations/adjustments', icon: ClipboardList },
      { name: 'Move History', href: '/operations/ledger', icon: History },
    ],
  },
  {
    name: 'Settings',
    icon: Settings,
    children: [
      { name: 'Warehouses', href: '/settings/warehouses', icon: Warehouse },
      { name: 'Categories', href: '/settings/categories', icon: FolderTree },
      { name: 'Units of Measure', href: '/settings/uom', icon: Ruler },
      { name: 'Users', href: '/settings/users', icon: Users },
    ],
  },
];

export const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">StockMaster</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Inventory Management</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground/80">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </div>
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <child.icon className="h-4 w-4" />
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
