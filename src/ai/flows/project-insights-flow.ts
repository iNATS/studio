
'use server';

/**
 * @fileOverview Provides AI-powered creative insights on projects.
 *
 * - getProjectVibe - A function that analyzes a project and returns its creative "vibe".
 * - ProjectVibeInput - The input type for the getProjectVibe function.
 * - ProjectVibeOutput - The return type for the getProjectVibe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ProjectVibeInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectDescription: z.string().describe('A detailed description of the project.'),
});
export type ProjectVibeInput = z.infer<typeof ProjectVibeInputSchema>;

export const ProjectVibeOutputSchema = z.object({
  aesthetic: z.string().describe('A 2-3 word summary of the overall design aesthetic (e.g., "Clean & Minimalist", "Bold & Energetic").'),
  keywords: z.array(z.string()).describe('A list of 3-5 keywords that capture the design essence (e.g., "monochromatic", "geometric", "playful").'),
});
export type ProjectVibeOutput = z.infer<typeof ProjectVibeOutputSchema>;

export async function getProjectVibe(input: ProjectVibeInput): Promise<ProjectVibeOutput> {
  return projectVibeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectVibePrompt',
  input: {schema: ProjectVibeInputSchema},
  output: {schema: ProjectVibeOutputSchema},
  prompt: `You are a world-class creative director analyzing a design project. Your task is to distill the project's creative essence into a concise "vibe" and a few keywords.

Analyze the following project details:

Project Title: {{{projectTitle}}}
Project Description: {{{projectDescription}}}

Based on this, determine the primary design aesthetic and the keywords that best describe its style. Be creative and insightful.`,
});

const projectVibeFlow = ai.defineFlow(
  {
    name: 'projectVibeFlow',
    inputSchema: ProjectVibeInputSchema,
    outputSchema: ProjectVibeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
