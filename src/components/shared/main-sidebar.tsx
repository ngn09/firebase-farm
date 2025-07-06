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
  PawPrint,
  Bot
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { APP_CONFIG } from '@/lib/constants';

const menuItems = [
  { href: '/dashboard', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { href: '/animals', label: 'Hayvanlar', icon: PawPrint },
  { href: '/inventory', label: 'Envanter', icon: Boxes },
  { href: '/feed-stock', label: 'Yem Stok', icon: Wheat },
  { href: '/health', label: 'Sağlık', icon: HeartPulse },
  { href: '/tasks', label: 'Görevler', icon: ClipboardCheck },
  { href: '/farm-map', label: 'Çiftlik Haritası', icon: Map },
  { href: '/crop-advisor', label: 'Mahsul Danışmanı', icon: Bot },
  { href: '/cameras', label: 'Kameralar', icon: Camera },
  { href: '/chat', label: 'Sohbet', icon: MessageCircle },
  { href: '/users', label: 'Kullanıcılar', icon: Users },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [farmName, setFarmName] = useState(APP_CONFIG.NAME);
  const [logo, setLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.FARM_NAME);
      const savedLogo = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.FARM_LOGO);
      
      if (savedName) setFarmName(savedName);
      if (savedLogo) setLogo(savedLogo);
    }
  }, []);

  const displayName = useMemo(() => 
    isMounted ? farmName : APP_CONFIG.NAME, 
    [isMounted, farmName]
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2" aria-label="Ana sayfa">
          {isMounted && logo ? (
            <Image 
              src={logo} 
              alt="Çiftlik Logosu" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-sm object-contain"
              priority
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          )}
          {!isCollapsed && (
            <h1 className="text-xl font-bold font-headline truncate">
              {displayName}
            </h1>
          )}
        </Link>
        <div className="hidden md:block">
          <SidebarTrigger />
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
                <Link href={item.href} aria-label={item.label}>
                  <item.icon className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" aria-label="Çıkış yap">
                <LogOut className="flex-shrink-0" />
                {!isCollapsed && <span>Çıkış Yap</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}