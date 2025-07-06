'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getCropRecommendation, type CropRecommendationOutput } from '@/ai/flows/crop-recommendation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Lightbulb, CheckCircle, Wheat, ThumbsUp, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  soilAnalysis: z.string().min(10, { message: "Lütfen toprak analizi hakkında daha fazla ayrıntı verin (örn. pH, azot seviyeleri)." }),
  weatherConditions: z.string().min(10, { message: "Lütfen hava durumunu açıklayın (örn. ortalama sıcaklık, yağış)." }),
  location: z.string().min(2, { message: "Konum gerekli." }),
  cropsGrownBefore: z.string().optional(),
});

export function AdvisorForm() {
  const [recommendation, setRecommendation] = useState<CropRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilAnalysis: "",
      weatherConditions: "",
      location: "",
      cropsGrownBefore: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await getCropRecommendation(values);
      setRecommendation(result);
      toast({
        title: "Öneri Hazır!",
        description: "Sizin için yeni mahsul önerileri oluşturduk.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Eyvah! Bir şeyler ters gitti.",
        description: "Öneri alınamadı. Lütfen daha sonra tekrar deneyin.",
      })
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Çiftlik Detayları</CardTitle>
          <CardDescription>Ne kadar çok ayrıntı verirseniz, öneri o kadar iyi olur.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="soilAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toprak Analizi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="örn., pH: 6.5, Azot: Yüksek, Fosfor: Orta, Potasyum: Düşük" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weatherConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hava Koşulları</FormLabel>
                      <FormControl>
                        <Textarea placeholder="örn., Ortalama sıcaklık: 25°C, Yıllık yağış: 800mm, güneşli iklim" {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konum</FormLabel>
                      <FormControl>
                        <Input placeholder="örn., Konya Ovası, Türkiye" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropsGrownBefore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daha Önce Yetiştirilen Mahsuller (İsteğe bağlı)</FormLabel>
                      <FormControl>
                        <Input placeholder="örn., Mısır, Soya Fasulyesi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : "Öneri Al"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="mt-8 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      )}

      {recommendation && (
        <div className="mt-8 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex-row items-center gap-4">
              <Wheat className="w-8 h-8 text-primary"/>
              <CardTitle className="text-primary">Önerilen Mahsuller</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{recommendation.recommendedCrops}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-4">
              <ThumbsUp className="w-8 h-8 text-accent"/>
              <CardTitle>Gerekçe</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{recommendation.reasoning}</p>
            </CardContent>
          </Card>
          {recommendation.additionalTips && (
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Sparkles className="w-8 h-8 text-yellow-500"/>
                <CardTitle>Ek İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{recommendation.additionalTips}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
