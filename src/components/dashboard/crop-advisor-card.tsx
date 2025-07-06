import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from 'lucide-react';

export function CropAdvisorCard() {
  return (
    <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-primary/10 rounded-full">
                 <Bot className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-grow">
                <CardTitle className="text-primary font-headline">YZ Mahsul Danışmanı</CardTitle>
                <CardDescription className="mt-2">Veriminizi en üst düzeye çıkarmak için çiftliğinizin toprak analizine ve yerel hava koşullarına göre kişiselleştirilmiş ürün önerileri alın.</CardDescription>
            </div>
            <Button asChild className="mt-4 md:mt-0 shrink-0">
                <Link href="/crop-advisor">
                    Öneri Al
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
