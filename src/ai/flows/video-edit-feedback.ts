'use server';

/**
 * @fileOverview A video edit feedback AI agent.
 *
 * - videoEditFeedback - A function that handles the video edit feedback process.
 * - VideoEditFeedbackInput - The input type for the videoEditFeedback function.
 * - VideoEditFeedbackOutput - The return type for the videoEditFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoEditFeedbackInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video edit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the video edit.'),
});
export type VideoEditFeedbackInput = z.infer<typeof VideoEditFeedbackInputSchema>;

const VideoEditFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-powered feedback on potential improvements.'),
});
export type VideoEditFeedbackOutput = z.infer<typeof VideoEditFeedbackOutputSchema>;

export async function videoEditFeedback(input: VideoEditFeedbackInput): Promise<VideoEditFeedbackOutput> {
  return videoEditFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoEditFeedbackPrompt',
  input: {schema: VideoEditFeedbackInputSchema},
  output: {schema: VideoEditFeedbackOutputSchema},
  prompt: `You are an expert video editor specializing in providing feedback on video edits based on industry standards.

You will use this information to provide feedback on the video edit, and suggest potential improvements.

Description: {{{description}}}
Video: {{media url=videoDataUri}}`,
});

const videoEditFeedbackFlow = ai.defineFlow(
  {
    name: 'videoEditFeedbackFlow',
    inputSchema: VideoEditFeedbackInputSchema,
    outputSchema: VideoEditFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
