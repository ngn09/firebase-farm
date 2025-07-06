
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardCopy, PlusCircle, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JoinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [farmId, setFarmId] = useState('');
  const [newFarmId, setNewFarmId] = useState('...');
  
  useEffect(() => {
    // Generate random ID on client mount to avoid hydration mismatch
    const generateUniqueId = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewFarmId(generateUniqueId());
  }, []);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(newFarmId);
    toast({
      title: 'Kopyalandı!',
      description: 'Yeni çiftlik ID panonuza kopyalandı.',
    });
  };

  const handleProceed = () => {
    toast({
      title: 'Çiftlik Oluşturuldu!',
      description: 'Gösterge paneline yönlendiriliyorsunuz.',
    });
    router.push('/dashboard');
  };
  
  const handleJoin = () => {
      if(farmId.trim().length > 0) {
        toast({
          title: 'Çiftliğe Katılma Başarılı!',
          description: 'Gösterge paneline yönlendiriliyorsunuz.',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'Lütfen geçerli bir çiftlik ID girin.',
        });
      }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Son Bir Adım...</h1>
            <p className="text-muted-foreground">Yeni bir çiftlik oluşturun veya mevcut birine katılın.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <PlusCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Yeni Bir Çiftlik Oluştur</CardTitle>
              <CardDescription>
                Yönetici olarak yeni bir çalışma alanı oluşturun. Bu ID'yi ekip arkadaşlarınızla paylaşarak onları davet edebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <Label>Benzersiz Çiftlik ID'niz</Label>
                  <div className="flex items-center justify-between p-3 mt-2 border rounded-md bg-muted/50">
                    <span className="font-mono text-lg tracking-widest">{newFarmId}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                      <ClipboardCopy className="h-5 w-5" />
                    </Button>
                  </div>
               </div>
              <Button className="w-full" onClick={handleProceed}>
                Gösterge Paneline Devam Et
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <LogIn className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Mevcut Çiftliğe Katıl</CardTitle>
              <CardDescription>
                Ekip arkadaşınızın paylaştığı Çiftlik ID'sini girerek mevcut bir çalışma alanına katılın.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farm-id">Çiftlik ID</Label>
                <Input
                  id="farm-id"
                  placeholder="ID Girin"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleJoin}>Çiftliğe Katıl</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
