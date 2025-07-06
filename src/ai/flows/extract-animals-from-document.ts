'use server';
/**
 * @fileOverview Extracts animal data from a document (PDF, XLSX).
 *
 * - extractAnimalsFromDocument - A function that parses a document and returns structured animal data.
 * - ExtractAnimalsInput - The input type for the function.
 * - ExtractAnimalsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas for the data structures
const AnimalSchema = z.object({
  tagNumber: z.string().describe('The unique tag number for the animal.'),
  species: z.string().describe('The species of the animal (e.g., İnek, Koyun).'),
  breed: z.string().describe('The breed of the animal (e.g., Holstein, Simental).'),
  gender: z.string().describe('The gender of the animal (Dişi or Erkek).'),
  birthDate: z.string().describe('The birth date of the animal in YYYY-MM-DD format.'),
  status: z.string().describe('The current status of the animal (e.g., Aktif, Hamile, Hasta).'),
  notes: z.string().optional().describe('Any additional notes about the animal.'),
});

export const ExtractAnimalsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractAnimalsInput = z.infer<typeof ExtractAnimalsInputSchema>;

export const ExtractAnimalsOutputSchema = z.object({
  animals: z.array(AnimalSchema).describe('An array of animal records extracted from the document.'),
});
export type ExtractAnimalsOutput = z.infer<typeof ExtractAnimalsOutputSchema>;

// Internal schema for the simplified flow
const FlowInputSchema = z.object({
    documentContent: z.string(),
});

// AI Prompt definition
const prompt = ai.definePrompt({
  name: 'extractAnimalsPrompt',
  input: {schema: FlowInputSchema},
  output: {schema: ExtractAnimalsOutputSchema},
  prompt: `You are a data extraction specialist for a farm management application. Your task is to analyze the provided text, which is extracted from a user's document (like a PDF or spreadsheet), and identify all animal records.

  Extract the following information for each animal:
  - tagNumber: The unique tag number.
  - species: The species (e.g., İnek, Koyun, Keçi).
  - breed: The breed (e.g., Holstein, Simental).
  - gender: The gender (Dişi or Erkek).
  - birthDate: The birth date. Convert it to YYYY-MM-DD format.
  - status: The current status (e.g., Aktif, Hamile, Hasta). If not specified, default to 'Aktif'.
  - notes: Any additional relevant notes.

  Return the data as a structured JSON object that conforms to the output schema. Pay close attention to the data types and field names. The user's document might be messy, so do your best to interpret the data accurately.

  Document Content:
  {{{documentContent}}}
  `,
});

// AI Flow definition (now simplified)
const extractAnimalsFlow = ai.defineFlow(
  {
    name: 'extractAnimalsFlow',
    inputSchema: FlowInputSchema,
    outputSchema: ExtractAnimalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// Public-facing server action that handles file parsing
export async function extractAnimalsFromDocument(input: ExtractAnimalsInput): Promise<ExtractAnimalsOutput> {
  const {documentDataUri} = input;
  const mimeType = documentDataUri.substring(5, documentDataUri.indexOf(';'));
  const base64Data = documentDataUri.substring(documentDataUri.indexOf(',') + 1);
  const documentBuffer = Buffer.from(base64Data, 'base64');

  let documentContent = '';

  // Dynamically import parsers ONLY within this server action
  if (mimeType === 'application/pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(documentBuffer);
    documentContent = data.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    const XLSX = (await import('xlsx'));
    const workbook = XLSX.read(documentBuffer, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    documentContent = XLSX.utils.sheet_to_csv(worksheet);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  if (!documentContent.trim()) {
    return {animals: []};
  }

  // Call the simplified flow with the extracted text
  return await extractAnimalsFlow({documentContent});
}
