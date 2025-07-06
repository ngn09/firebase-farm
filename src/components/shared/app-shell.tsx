
'use client';

import { usePathname } from 'next/navigation';
import { MainSidebar } from '@/components/shared/main-sidebar';
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/', '/register', '/join'];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <MainSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
        </div>
      </SidebarProvider>
    );
  }

  return <main className="min-h-screen bg-muted/40">{children}</main>;
}
