import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FarmMapPreview() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Çiftlik Haritası</CardTitle>
        <CardDescription>Tarlalarınızı ve mahsul durumunu görselleştirin.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href="/farm-map">
            <div className="aspect-video relative rounded-lg overflow-hidden border group cursor-pointer">
            <Image src="https://placehold.co/800x450.png" alt="Çiftlik haritası önizlemesi" fill className="object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint="farm aerial" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Haritayı Görüntüle</span>
            </div>
            </div>
        </Link>
      </CardContent>
    </Card>
  );
}
