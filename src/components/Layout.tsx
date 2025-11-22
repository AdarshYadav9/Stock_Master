import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AppBreadcrumbs } from './Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-4">
            <AppBreadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
