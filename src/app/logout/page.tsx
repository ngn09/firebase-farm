import { LogOut } from 'lucide-react';

export default function LogoutPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex items-center gap-4">
        <LogOut className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Çıkış Yap</h1>
          <p className="text-muted-foreground">Oturumunuz sonlandırılıyor.</p>
        </div>
      </header>
      <div className="flex justify-center items-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Çıkış yapma mantığı burada yer alacak.</p>
      </div>
    </div>
  );
}
