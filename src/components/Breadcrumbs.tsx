import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

export const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (path: string): string => {
    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      products: 'Products',
      operations: 'Operations',
      receipts: 'Receipts',
      deliveries: 'Deliveries',
      transfers: 'Transfers',
      adjustments: 'Adjustments',
      ledger: 'Move History',
      settings: 'Settings',
      warehouses: 'Warehouses',
      categories: 'Categories',
      uom: 'Units of Measure',
      users: 'Users',
      new: 'New',
    };
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const breadcrumbs: BreadcrumbItemType[] = [
    { label: 'Home', href: '/dashboard' },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      return {
        label: getBreadcrumbLabel(value),
        href: isLast ? undefined : to,
      };
    }),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

