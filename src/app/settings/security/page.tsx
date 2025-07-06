
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Laptop, Smartphone, Tablet, LogOut } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const PasswordChangeDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSave = () => {
        if (!newPassword || newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Yeni şifre en az 6 karakter olmalıdır.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ variant: 'destructive', title: 'Hata', description: 'Yeni şifreler eşleşmiyor.' });
            return;
        }
        toast({ title: 'Başarılı', description: 'Şifreniz başarıyla değiştirildi.' });
        setIsOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-full text-left p-4 border rounded-lg ring-2 ring-primary transition-colors">
                    <h3 className="font-semibold text-card-foreground">Parola Değiştir</h3>
                    <p className="text-sm text-muted-foreground">Hesap parolanızı güncelleyin</p>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Parolayı Değiştir</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Mevcut Parola</Label>
                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Yeni Parola</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-new-password">Yeni Parola Tekrar</Label>
                        <Input id="confirm-new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">İptal</Button></DialogClose>
                    <Button onClick={handleSave}>Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const TwoFactorAuthDialog = () => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            toast({ title: '2FA Etkinleştirildi', description: 'Doğrulama kodunu taratın ve girin.' });
        } else {
            toast({ title: '2FA Devre Dışı Bırakıldı', description: 'Hesabınızda 2FA koruması kaldırıldı.', variant: 'destructive' });
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors">
                    <h3 className="font-semibold text-card-foreground">İki Faktörlü Kimlik Doğrulama</h3>
                    <p className="text-sm text-muted-foreground">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>İki Faktörlü Kimlik Doğrulama (2FA)</DialogTitle>
                    <DialogDescription>Hesabınızı daha güvenli hale getirmek için 2FA'yı etkinleştirin.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <Label htmlFor="2fa-switch" className="font-medium">2FA'yı Etkinleştir</Label>
                        <Switch id="2fa-switch" checked={isEnabled} onCheckedChange={handleToggle} />
                    </div>
                    {isEnabled && (
                        <div className="p-4 border-l-4 border-primary bg-primary/10 rounded-r-md space-y-4">
                            <p className="text-sm text-primary">1. Authenticator uygulamanızla bu QR kodu tarayın.</p>
                            <div className="flex justify-center">
                                <Image src="https://placehold.co/160x160.png" alt="QR Code" width={160} height={160} data-ai-hint="qr code" />
                            </div>
                             <p className="text-sm text-primary">2. Uygulamadan aldığınız 6 haneli kodu girin.</p>
                             <Input placeholder="123456" maxLength={6} />
                        </div>
                    )}
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Kapat</Button></DialogClose>
                    {isEnabled && <Button>Doğrula ve Bitir</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SessionHistoryDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const mockSessions: { device: string; location: string; time: string; icon: React.ElementType }[] = [
      { device: "Masaüstü - Chrome", location: "İstanbul, TR", time: "Aktif", icon: Laptop },
      { device: "iPhone 15 Pro", location: "Ankara, TR", time: "2 saat önce", icon: Smartphone },
      { device: "iPad Air", location: "İzmir, TR", time: "Dün", icon: Tablet },
    ];
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors">
                    <h3 className="font-semibold text-card-foreground">Oturum Geçmişi</h3>
                    <p className="text-sm text-muted-foreground">Son oturum açma işlemlerinizi görüntüleyin</p>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Oturum Geçmişi</DialogTitle>
                    <DialogDescription>Hesabınıza yapılan son girişler.</DialogDescription>
                </DialogHeader>
                <div className="py-2 max-h-80 overflow-y-auto pr-2">
                    <ul className="space-y-4">
                        {mockSessions.length === 0 ? (
                            <li className="text-center text-sm text-muted-foreground py-4">Oturum geçmişi bulunmuyor.</li>
                        ) : (
                            mockSessions.map((session, index) => (
                                <li key={index} className="flex items-center gap-4 p-3 border rounded-md">
                                    <session.icon className="h-6 w-6 text-muted-foreground" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{session.device}</p>
                                        <p className="text-sm text-muted-foreground">{session.location}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{session.time}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                <DialogFooter className="border-t pt-4">
                    <DialogClose asChild><Button variant="outline">Kapat</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function SecuritySettingsPage() {
    const { toast } = useToast();

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Güvenlik Ayarları</h1>
                <p className="text-muted-foreground">Hesap güvenliğinizi yönetin.</p>
            </header>
            <div className="max-w-md mx-auto space-y-3">
                <PasswordChangeDialog />
                <TwoFactorAuthDialog />
                <SessionHistoryDialog />
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <button className="w-full text-left p-4 border rounded-lg hover:bg-destructive/10 transition-colors">
                        <div className="flex items-center gap-2 text-destructive">
                            <LogOut className="h-5 w-5" />
                            <h3 className="font-semibold">Tüm Cihazlardan Çıkış Yap</h3>
                        </div>
                        <p className="text-sm text-muted-foreground pl-7">Mevcut oturumunuz hariç tüm oturumları sonlandırın</p>
                    </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tüm cihazlardan çıkış yapmak istediğinizden emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                        Bu işlem geri alınamaz. Mevcut oturumunuz hariç tüm oturumlar sonlandırılacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => toast({title: "Oturumlar sonlandırıldı."})} 
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Evet, Çıkış Yap
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
