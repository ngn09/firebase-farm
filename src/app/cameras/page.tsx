
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Video, VideoOff, Camera as CameraIcon, Plus, Trash2 } from "lucide-react";

export interface Camera {
  id: number;
  name: string;
  url?: string;
  status: 'active' | 'offline';
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [newCameraName, setNewCameraName] = useState('');
  const [newCameraUrl, setNewCameraUrl] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedCameras = localStorage.getItem('farm-cameras');
      if (savedCameras) {
        setCameras(JSON.parse(savedCameras));
      }
    } catch (error) {
      console.error("Failed to load cameras from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
      localStorage.setItem('farm-cameras', JSON.stringify(cameras));
    } catch (error) {
      console.error("Failed to save cameras to localStorage", error);
    }
  }, [cameras]);

  const activeCameras = cameras.filter(c => c.status === 'active').length;
  const offlineCameras = cameras.filter(c => c.status === 'offline').length;
  const totalCameras = cameras.length;

  const handleAddCamera = () => {
    if (newCameraName.trim() === '') return;
    const newCamera: Camera = {
      id: Date.now(),
      name: newCameraName.trim(),
      url: newCameraUrl.trim() || undefined,
      status: 'active', // Assume new cameras are active initially
    };
    setCameras([...cameras, newCamera]);
    setNewCameraName('');
    setNewCameraUrl('');
  };

  const handleDeleteCamera = (id: number) => {
    setCameras(cameras.filter(c => c.id !== id));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Kameralar</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              Kamera Ayarları
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Kamera Ayarları</DialogTitle>
              <DialogDescription>
                Kameralarınızı buradan ekleyebilir veya silebilirsiniz. Canlı yayın URL'sini (örn: RTSP, HLS) girin.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Yeni Kamera Ekle</h3>
                <div className="flex items-end gap-2">
                  <div className="flex-grow space-y-1">
                    <Label htmlFor="camera-name">Kamera Adı</Label>
                    <Input id="camera-name" placeholder="Örn: Ahır Girişi" value={newCameraName} onChange={(e) => setNewCameraName(e.target.value)} />
                  </div>
                  <div className="flex-grow space-y-1">
                    <Label htmlFor="camera-url">Yayın URL (İsteğe bağlı)</Label>
                    <Input id="camera-url" placeholder="rtsp://... veya https://.../stream.m3u8" value={newCameraUrl} onChange={(e) => setNewCameraUrl(e.target.value)} />
                  </div>
                  <Button onClick={handleAddCamera} size="icon" className="shrink-0 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Mevcut Kameralar</h3>
                <div className="space-y-2">
                  {cameras.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Henüz kamera eklenmemiş.</p>
                  ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {cameras.map(camera => (
                        <li key={camera.id} className="flex items-center justify-between p-2 rounded-md border">
                          <div>
                            <p className="font-medium">{camera.name}</p>
                            <p className="text-xs text-muted-foreground">{camera.url || 'Yerel kamera'}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCamera(camera.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Kapat</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kameralar</CardTitle>
            <Video className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCameras}</div>
            <p className="text-xs text-muted-foreground">Canlı yayın aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Çevrimdışı</CardTitle>
            <VideoOff className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{offlineCameras}</div>
            <p className="text-xs text-muted-foreground">Bağlantı sorunu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kamera</CardTitle>
            <CameraIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCameras}</div>
            <p className="text-xs text-muted-foreground">Tüm kurulu kameralar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kamera Görüntüleri</CardTitle>
        </CardHeader>
        <CardContent>
          {cameras.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg text-center p-4">
              <CameraIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">Gösterilecek kamera yok.</p>
              <p className="text-sm text-muted-foreground">Lütfen 'Kamera Ayarları'ndan yeni bir kamera ekleyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cameras.map(camera => (
                <Card key={camera.id} className="overflow-hidden">
                  <CardHeader className="flex-row items-center justify-between p-4">
                    <CardTitle className="text-base">{camera.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video relative bg-muted flex items-center justify-center">
                      {camera.status === 'active' ? (
                        <Image src={camera.url || `https://placehold.co/600x400.png`} alt={camera.name} fill objectFit="cover" data-ai-hint="security camera" />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <VideoOff className="w-12 h-12 mx-auto mb-2"/>
                          <p>Kamera çevrimdışı</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
