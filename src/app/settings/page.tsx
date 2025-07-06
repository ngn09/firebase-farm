
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Users, Bell, Shield, Database, Home, ImageIcon, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const settingsItems = [
  {
    icon: Home,
    title: 'Çiftlik Ayarları',
    description: 'Çiftlik adını ve logosunu özelleştirin',
    buttonText: 'Ayarları Düzenle',
    action: 'dialog' as const,
    dialogType: 'farm',
  },
  {
    icon: Users,
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcı rollerini ve izinlerini yönetin',
    buttonText: 'Kullanıcıları Yönet',
    link: '/users',
    action: 'link' as const,
  },
  {
    icon: Bell,
    title: 'Bildirim Ayarları',
    description: 'Bildirim tercihlerinizi ayarlayın',
    buttonText: 'Bildirimleri Ayarla',
    action: 'dialog' as const,
    dialogType: 'notifications',
  },
  {
    icon: Shield,
    title: 'Güvenlik',
    description: 'Parola ve güvenlik ayarları',
    buttonText: 'Güvenlik Ayarları',
    link: '/settings/security',
    action: 'link' as const,
  },
  {
    icon: Database,
    title: 'Veri Yönetimi',
    description: 'Veri yedekleme ve geri yükleme',
    buttonText: 'Veri Ayarları',
    action: 'dialog' as const,
    dialogType: 'data',
  },
];

const FarmSettingsDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [farmName, setFarmName] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if(isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (isOpen) {
            try {
                const savedName = localStorage.getItem('farmName') || 'Çiftlik Yrd.';
                const savedLogo = localStorage.getItem('farmLogo');
                setFarmName(savedName);
                setLogo(savedLogo);
            } catch (error) {
                console.error("Failed to access localStorage", error);
            }
        }
    }, [isOpen]);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        try {
            localStorage.setItem('farmName', farmName);
            if (logo) {
                localStorage.setItem('farmLogo', logo);
            } else {
                localStorage.removeItem('farmLogo');
            }
            toast({ title: 'Başarılı', description: 'Çiftlik ayarları kaydedildi. Değişikliklerin görünmesi için sayfa yenileniyor.' });
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Failed to save to localStorage", error);
            toast({ title: 'Hata', description: 'Ayarlar kaydedilemedi.', variant: 'destructive'});
        }
    };

    const removeLogo = () => {
        setLogo(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Ayarları Düzenle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Çiftlik Ayarları</DialogTitle>
                    <DialogDescription>Çiftliğinizin adını ve logosunu buradan değiştirebilirsiniz.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="farm-name">Çiftlik Adı</Label>
                        <Input id="farm-name" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="farm-logo">Çiftlik Logosu</Label>
                        <Input id="farm-logo-input" type="file" className="hidden" ref={fileInputRef} onChange={handleLogoChange} accept="image/png, image/jpeg, image/svg+xml" />
                        <Card className="flex items-center gap-4 p-4">
                            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                                {logo ? (
                                    <Image src={logo} alt="Logo Önizleme" width={64} height={64} className="object-contain w-full h-full rounded-md" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-grow space-y-2">
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Logo Yükle</Button>
                                {logo && (
                                     <Button variant="ghost" size="sm" className="text-destructive" onClick={removeLogo}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Logoyu Kaldır
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">İptal</Button></DialogClose>
                    <Button onClick={handleSave}>Kaydet ve Yenile</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const NotificationSettingsDialog = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
        title: "Ayarlar Kaydedildi!",
        description: "Bildirim tercihleriniz başarıyla güncellendi."
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          Bildirimleri Ayarla
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bildirim Ayarları</DialogTitle>
          <DialogDescription>Hangi bildirimleri almak istediğinizi seçin.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <h3 className="mb-4 font-medium text-card-foreground">Genel Bildirimler</h3>
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-3">
                <Checkbox id="email" checked={emailNotifications} onCheckedChange={(checked) => setEmailNotifications(Boolean(checked))} />
                <Label htmlFor="email" className="font-normal text-sm">E-posta Bildirimleri</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="sms" checked={smsNotifications} onCheckedChange={(checked) => setSmsNotifications(Boolean(checked))} />
                <Label htmlFor="sms" className="font-normal text-sm">SMS Bildirimleri</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="push" checked={pushNotifications} onCheckedChange={(checked) => setPushNotifications(Boolean(checked))} />
                <Label htmlFor="push" className="font-normal text-sm">Push Bildirimleri</Label>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-medium text-card-foreground">Özel Uyarılar</h3>
            <div className="space-y-3 pl-1">
              <div className="flex items-center space-x-3">
                <Checkbox id="health" checked={healthAlerts} onCheckedChange={(checked) => setHealthAlerts(Boolean(checked))} />
                <Label htmlFor="health" className="font-normal text-sm">Sağlık Uyarıları</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="inventory" checked={inventoryAlerts} onCheckedChange={(checked) => setInventoryAlerts(Boolean(checked))} />
                <Label htmlFor="inventory" className="font-normal text-sm">Envanter Uyarıları</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
           <DialogClose asChild>
             <Button variant="outline">Kapat</Button>
           </DialogClose>
           <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveChanges}>
            Ayarları Kaydet
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DataManagementDialog = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      data: {
        message: "Bu, simüle edilmiş bir yedekleme dosyasıdır.",
        users: 4,
        animals: 3,
        inventory: 4,
      },
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `farm-backup-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({
      title: 'Yedekleme Başarılı',
      description: 'Verileriniz başarıyla yedeklendi ve indirildi.',
    });
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      toast({
        title: 'Geri Yükleme Başlatıldı',
        description: `${file.name} dosyasından veriler geri yükleniyor.`,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Ad,Kategori,Değer\nTraktör,Araç,1500000\nSüt Sağım Makinesi,Ekipman,75000';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'envanter_verileri.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast({
      title: 'Dışa Aktarma Başarılı',
      description: 'Verileriniz CSV formatında başarıyla dışa aktarıldı.',
    });
  };

  const handleClearData = () => {
    try {
        localStorage.clear();
        toast({
          variant: 'destructive',
          title: 'Veriler Temizlendi!',
          description: 'Tüm uygulama verileri kalıcı olarak silindi. Sayfa yenileniyor...',
        });
        setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
        console.error(e);
        toast({ title: 'Hata', description: 'Veriler temizlenemedi.', variant: 'destructive'});
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".json"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Veri Ayarları
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Veri Yönetimi</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <button
              onClick={handleBackup}
              className="w-full text-left p-4 border rounded-lg ring-2 ring-primary transition-colors"
            >
              <h3 className="font-semibold text-card-foreground">
                Veri Yedekleme
              </h3>
              <p className="text-sm text-muted-foreground">
                Tüm verilerinizi yedekleyin
              </p>
            </button>
            <button
              onClick={handleRestoreClick}
              className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-card-foreground">
                Veri Geri Yükleme
              </h3>
              <p className="text-sm text-muted-foreground">
                Önceki yedekten verileri geri yükleyin
              </p>
            </button>
            <button
              onClick={handleExport}
              className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-card-foreground">
                Veri Dışa Aktarma
              </h3>
              <p className="text-sm text-muted-foreground">
                Verilerinizi CSV/Excel formatında indirin
              </p>
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full text-left p-4 border rounded-lg border-destructive/50 hover:bg-destructive/10 transition-colors">
                  <h3 className="font-semibold text-destructive">
                    Veri Temizleme
                  </h3>
                  <p className="text-sm text-destructive/90">
                    Eski verileri temizleyin (Geri alınamaz)
                  </p>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Tüm uygulama verileri kalıcı olarak
                    silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Evet, Verileri Temizle
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Ayarlar</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsItems.map((item, index) => (
          <Card key={index} className="flex flex-col">
            <CardContent className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              <div className="mt-auto pt-6">
                {item.action === 'dialog' ? (
                  <>
                    {item.dialogType === 'farm' && <FarmSettingsDialog />}
                    {item.dialogType === 'notifications' && <NotificationSettingsDialog />}
                    {item.dialogType === 'data' && <DataManagementDialog />}
                  </>
                ) : (
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Link href={item.link!}>{item.buttonText}</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
