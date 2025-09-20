'use server';
/**
 * @fileOverview Summarizes common player positioning on the interactive field using an LLM.
 *
 * - summarizeTacticalPositioning - A function that handles the summarization of tactical positioning.
 * - SummarizeTacticalPositioningInput - The input type for the summarizeTacticalPositioning function.
 * - SummarizeTacticalPositioningOutput - The return type for the summarizeTacticalPositioning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTacticalPositioningInputSchema = z.object({
  positioningDescription: z
    .string()
    .describe('A description of the player positioning on the field.'),
});
export type SummarizeTacticalPositioningInput = z.infer<
  typeof SummarizeTacticalPositioningInputSchema
>;

const SummarizeTacticalPositioningOutputSchema = z.object({
  summary: z.string().describe('A summary of the tactical positioning.'),
});
export type SummarizeTacticalPositioningOutput = z.infer<
  typeof SummarizeTacticalPositioningOutputSchema
>;

export async function summarizeTacticalPositioning(
  input: SummarizeTacticalPositioningInput
): Promise<SummarizeTacticalPositioningOutput> {
  return summarizeTacticalPositioningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTacticalPositioningPrompt',
  input: {schema: SummarizeTacticalPositioningInputSchema},
  output: {schema: SummarizeTacticalPositioningOutputSchema},
  prompt: `You are an expert soccer coach.

You will be given a description of player positioning on the field.

Your job is to summarize the tactical positioning in a concise manner.

Description: {{{positioningDescription}}}`,
});

const summarizeTacticalPositioningFlow = ai.defineFlow(
  {
    name: 'summarizeTacticalPositioningFlow',
    inputSchema: SummarizeTacticalPositioningInputSchema,
    outputSchema: SummarizeTacticalPositioningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
