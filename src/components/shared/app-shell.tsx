'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SidebarProvider } from "@/components/ui/sidebar";

// Dynamic import for sidebar to reduce initial bundle
const MainSidebar = dynamic(() => import('@/components/shared/main-sidebar').then(mod => ({ default: mod.MainSidebar })), {
  loading: () => <div className="w-64 bg-sidebar animate-pulse" />,
  ssr: false
});

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/', '/register', '/join'];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <MainSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40">
      {children}
    </main>
  );
}