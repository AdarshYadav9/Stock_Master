import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { AppBreadcrumbs } from './Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopBar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-4">
          <AppBreadcrumbs />
        </div>
        {children}
      </main>
    </div>
  );
};