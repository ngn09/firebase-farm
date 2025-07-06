// 'use server'
'use server';

/**
 * @fileOverview Provides AI-powered crop recommendations based on soil analysis and weather conditions.
 *
 * - getCropRecommendation - A function that generates crop recommendations.
 * - CropRecommendationInput - The input type for the getCropRecommendation function.
 * - CropRecommendationOutput - The return type for the getCropRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropRecommendationInputSchema = z.object({
  soilAnalysis: z
    .string()
    .describe('pH, azot, fosfor ve potasyum seviyeleri dahil olmak üzere toprak analizi verileri.'),
  weatherConditions: z
    .string()
    .describe('Sıcaklık, yağış ve güneş ışığı dahil olmak üzere mevcut ve tahmin edilen hava koşulları.'),
  location: z.string().describe('Çiftliğin coğrafi konumu.'),
  cropsGrownBefore: z
    .string()
    .optional()
    .describe('Ürün rotasyonuna rehberlik etmesi için çiftlikte daha önce yetiştirilen ürünler.'),
});

export type CropRecommendationInput = z.infer<typeof CropRecommendationInputSchema>;

const CropRecommendationOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe('Toprak analizi ve hava koşullarına göre önerilen mahsullerin bir listesi.'),
  reasoning: z
    .string()
    .describe('Toprak uygunluğu ve iklim uyumluluğu da dahil olmak üzere ürün önerilerinin arkasındaki mantık.'),
  additionalTips: z
    .string()
    .optional()
    .describe('Önerilen mahsulleri ekmek ve yetiştirmek için ek ipuçları, örneğin optimum ekim zamanları ve gübreleme stratejileri.'),
});

export type CropRecommendationOutput = z.infer<typeof CropRecommendationOutputSchema>;

export async function getCropRecommendation(input: CropRecommendationInput): Promise<CropRecommendationOutput> {
  return cropRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropRecommendationPrompt',
  input: {schema: CropRecommendationInputSchema},
  output: {schema: CropRecommendationOutputSchema},
  prompt: `Siz uzman bir ziraat danışmanısınız. Toprak analizi, hava koşulları ve çiftlik konumuna göre ürün önerilerinde bulunun.

  Toprak Analizi: {{{soilAnalysis}}}
  Hava Koşulları: {{{weatherConditions}}}
  Konum: {{{location}}}
  Daha Önce Yetiştirilen Mahsuller: {{{cropsGrownBefore}}}

  Önerilen mahsullerin bir listesini, önerilerinizin arkasındaki gerekçeyi ve önerilen mahsulleri ekmek ve yetiştirmek için ek ipuçları sağlayın.`,
});

const cropRecommendationFlow = ai.defineFlow(
  {
    name: 'cropRecommendationFlow',
    inputSchema: CropRecommendationInputSchema,
    outputSchema: CropRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
