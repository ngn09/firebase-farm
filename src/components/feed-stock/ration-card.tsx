'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import type { Ration } from './ration-management-tab';
import { useToast } from "@/hooks/use-toast";

interface RationCardProps {
  ration: Ration;
  onArchive: (id: number) => void;
  onUpdate: (ration: Ration) => void;
  isArchived: boolean;
}

export function RationCard({ ration, onArchive, onUpdate, isArchived }: RationCardProps) {
  const { toast } = useToast();

  const handleAutoDeductChange = (checked: boolean) => {
      onUpdate({ ...ration, autoDeduct: checked });
      if(checked) {
          toast({
              title: "Otomatik Düşüm Aktif",
              description: `${ration.name} için stoktan otomatik düşüm başlatıldı.`
          })
      }
  };

  const handleAnimalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ ...ration, animalCount: Number(e.target.value) });
  };
  
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-lg">{ration.name}</CardTitle>
            </div>
            <div className="flex items-center gap-4">
                {!isArchived && (
                  <>
                    <div className="flex items-center space-x-2">
                        <Switch id={`auto-deduct-${ration.id}`} checked={ration.autoDeduct} onCheckedChange={handleAutoDeductChange} />
                        <Label htmlFor={`auto-deduct-${ration.id}`} className="text-sm font-normal">Otomatik Düşüm</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor={`animal-count-${ration.id}`} className="text-sm">Hayvan Sayısı:</Label>
                        <Input id={`animal-count-${ration.id}`} type="number" className="w-20 h-8" value={ration.animalCount} onChange={handleAnimalCountChange} />
                    </div>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => onArchive(ration.id)}>
                    {isArchived ? <ArchiveRestore className="mr-2 h-4 w-4" /> : <Archive className="mr-2 h-4 w-4" />}
                    {isArchived ? 'Geri Al' : 'Arşivle'}
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2 px-2">
                <div>Yem Adı</div>
                <div className="text-right">Miktar (kg/gün)</div>
            </div>
             {ration.feedItems.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 py-3 border-b last:border-b-0 px-2">
                    <div>{item.name}</div>
                    <div className="text-right font-medium">{item.quantity}</div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
