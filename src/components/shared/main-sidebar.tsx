
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  Leaf, 
  LayoutDashboard, 
  Boxes, 
  Wheat, 
  HeartPulse, 
  Camera, 
  MessageCircle, 
  Users, 
  Settings,
  LogOut,
  Map,
  ClipboardCheck,
  PawPrint
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  { href: '/dashboard', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { href: '/animals', label: 'Hayvanlar', icon: PawPrint },
  { href: '/inventory', label: 'Envanter', icon: Boxes },
  { href: '/feed-stock', label: 'Yem Stok', icon: Wheat },
  { href: '/health', label: 'Sağlık', icon: HeartPulse },
  { href: '/tasks', label: 'Görevler', icon: ClipboardCheck },
  { href: '/farm-map', label: 'Çiftlik Haritası', icon: Map },
  { href: '/cameras', label: 'Kameralar', icon: Camera },
  { href: '/chat', label: 'Sohbet', icon: MessageCircle },
  { href: '/users', label: 'Kullanıcılar', icon: Users },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [farmName, setFarmName] = useState('mir');
  const [logo, setLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedName = localStorage.getItem('farmName');
      const savedLogo = localStorage.getItem('farmLogo');
      if (savedName) setFarmName(savedName);
      if (savedLogo) setLogo(savedLogo);
    } catch (error) {
        console.error("Could not access local storage:", error);
    }
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            {isMounted && logo ? (
                <Image src={logo} alt="Farm Logo" width={32} height={32} className="w-8 h-8 rounded-sm object-contain" />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                   <Leaf className="w-8 h-8 text-primary" />
                </div>
            )}
            {!isCollapsed && (
              <h1 className="text-xl font-bold font-headline">
                  {isMounted ? farmName : 'mir'}
              </h1>
            )}
          </Link>
          <div className="hidden md:block">
            <SidebarTrigger/>
          </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                >
                  <Link href="/">
                    <LogOut />
                    {!isCollapsed && <span>Çıkış Yap</span>}
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
