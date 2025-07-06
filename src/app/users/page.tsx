
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardCopy, Pencil, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const rolesWithDescriptions = {
  'Yönetici': 'Tüm yönetim ve ayar yetkilerine sahiptir.',
  'Veteriner': 'Hayvan sağlığı kayıtlarına erişebilir ve düzenleyebilir.',
  'Bakıcı': 'Hayvanların günlük bakım ve görevlerini yönetir.',
  'İşçi': 'Atanan görevleri ve temel çiftlik bilgilerini görüntüler.',
} as const;

type UserRole = keyof typeof rolesWithDescriptions;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: 'Aktif' | 'Pasif';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const isInitialMount = useRef(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('İşçi');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { toast } = useToast();
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    const generateUniqueId = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroupId(generateUniqueId());

    try {
      const savedUsers = localStorage.getItem('farm-users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-users', JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    if (isUserDialogOpen) {
      if (editingUser) {
        setName(editingUser.name);
        setEmail(editingUser.email);
        setRole(editingUser.role);
        setPassword('');
        setConfirmPassword('');
      } else {
        setName('');
        setEmail('');
        setRole('İşçi');
        setPassword('');
        setConfirmPassword('');
      }
    }
  }, [isUserDialogOpen, editingUser]);


  const handleCopyGroupId = () => {
    navigator.clipboard.writeText(groupId);
    toast({
      title: 'Kopyalandı!',
      description: 'Grup ID panoya kopyalandı.',
    });
  };

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
  };
  
  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
     toast({
      variant: "destructive",
      title: "Başarılı",
      description: "Kullanıcı silindi.",
    });
  };

  const openNewUserDialog = () => {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  }

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  }

  const handleSaveUser = () => {
    if (name.trim() === '' || email.trim() === '') {
        toast({
            variant: "destructive",
            title: "Hata",
            description: "Ad soyad ve e-posta alanları zorunludur."
        });
        return;
    }

    if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? {...u, name, email, role} : u));
        toast({ title: "Başarılı", description: "Kullanıcı bilgileri güncellendi." });
    } else {
        if (password.trim() === '' || confirmPassword.trim() === '') {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Şifre alanları zorunludur."
            });
            return;
        }
        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Şifreler eşleşmiyor."
            });
            return;
        }
        const newUser: User = {
            id: Math.max(0, ...users.map(u => u.id)) + 1,
            name,
            email,
            role,
            status: 'Aktif'
        };
        setUsers([...users, newUser]);
        toast({ title: "Başarılı", description: "Yeni kullanıcı eklendi." });
    }

    setIsUserDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={openNewUserDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Kullanıcı
        </Button>
      </div>
      
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle>
                    <DialogDescription>
                       {editingUser ? 'Kullanıcı bilgilerini güncelleyin.' : 'Yeni bir kullanıcı oluşturun ve rol atayın.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test@example.com" />
                    </div>
                     {!editingUser && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="password">Şifre</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select onValueChange={(value: UserRole) => setRole(value)} value={role}>
                            <SelectTrigger>
                                <SelectValue placeholder="Rol seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(rolesWithDescriptions).map((roleKey) => (
                                    <SelectItem key={roleKey} value={roleKey}>
                                        {roleKey}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {rolesWithDescriptions[role]}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">İptal</Button></DialogClose>
                    <Button onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">{editingUser ? 'Güncelle' : 'Oluştur'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Ekibinizi Davet Edin</CardTitle>
          <CardDescription>
            Ekip arkadaşlarınızı çiftliğinize davet etmek için aşağıdaki Grup ID'sini paylaşın. Onlar bu ID'yi kullanarak gruba katılabilirler.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
            <span className="font-mono text-lg tracking-widest">{groupId}</span>
            <Button variant="ghost" size="icon" onClick={handleCopyGroupId}>
              <ClipboardCopy className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="w-[150px]">
                  <Select value={user.role} onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                       {Object.keys(rolesWithDescriptions).map((roleKey) => (
                          <SelectItem key={roleKey} value={roleKey}>
                              {roleKey}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Aktif' ? 'default' : 'secondary'}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditUserDialog(user)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Bu işlem geri alınamaz. Kullanıcı kalıcı olarak silinecektir.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Evet, Sil</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
