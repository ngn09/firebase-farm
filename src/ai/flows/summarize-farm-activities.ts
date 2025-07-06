// Summarize Farm Activities
'use server';
/**
 * @fileOverview Summarizes farm activities such as fertilizing, planting, and harvesting.
 *
 * - summarizeFarmActivities - A function that handles the summarization of farm activities.
 * - SummarizeFarmActivitiesInput - The input type for the summarizeFarmActivities function.
 * - SummarizeFarmActivitiesOutput - The return type for the summarizeFarmActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFarmActivitiesInputSchema = z.object({
  activities: z
    .string()
    .describe('Gübreleme, ekim ve hasat gibi çiftlik faaliyetlerinin bir listesi.'),
});
export type SummarizeFarmActivitiesInput = z.infer<typeof SummarizeFarmActivitiesInputSchema>;

const SummarizeFarmActivitiesOutputSchema = z.object({
  summary: z.string().describe('Çiftlik faaliyetlerinin bir özeti.'),
});
export type SummarizeFarmActivitiesOutput = z.infer<typeof SummarizeFarmActivitiesOutputSchema>;

export async function summarizeFarmActivities(
  input: SummarizeFarmActivitiesInput
): Promise<SummarizeFarmActivitiesOutput> {
  return summarizeFarmActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFarmActivitiesPrompt',
  input: {schema: SummarizeFarmActivitiesInputSchema},
  output: {schema: SummarizeFarmActivitiesOutputSchema},
  prompt: `Siz uzman bir çiftlik yöneticisisiniz.

Çiftlik faaliyetlerini özetlemek için bu bilgileri kullanacaksınız.

Faaliyetler: {{{activities}}}`,
});

const summarizeFarmActivitiesFlow = ai.defineFlow(
  {
    name: 'summarizeFarmActivitiesFlow',
    inputSchema: SummarizeFarmActivitiesInputSchema,
    outputSchema: SummarizeFarmActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
