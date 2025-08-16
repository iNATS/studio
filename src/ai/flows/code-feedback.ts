// This file uses server-side code, and must have the `'use server'` directive.
'use server';

/**
 * @fileOverview Provides AI-powered feedback on code snippets.
 *
 * - codeFeedback - A function that takes code as input and returns feedback.
 * - CodeFeedbackInput - The input type for the codeFeedback function.
 * - CodeFeedbackOutput - The return type for the codeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeFeedbackInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
  language: z.string().optional().describe('The programming language of the code.'),
});
export type CodeFeedbackInput = z.infer<typeof CodeFeedbackInputSchema>;

const CodeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-powered feedback on the code snippet.'),
});
export type CodeFeedbackOutput = z.infer<typeof CodeFeedbackOutputSchema>;

export async function codeFeedback(input: CodeFeedbackInput): Promise<CodeFeedbackOutput> {
  return codeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codeFeedbackPrompt',
  input: {schema: CodeFeedbackInputSchema},
  output: {schema: CodeFeedbackOutputSchema},
  prompt: `You are an AI code reviewer that provides constructive feedback on code snippets based on industry standards.

  Analyze the following code snippet and provide specific suggestions for improvements, focusing on code quality, efficiency, and best practices. Consider the language provided if it is not empty, otherwise infer the language from the code.
  \n  Code:\n  ```{{language}}\n  {{{code}}}\n  ```\n  \n  Feedback:`,
});

const codeFeedbackFlow = ai.defineFlow(
  {
    name: 'codeFeedbackFlow',
    inputSchema: CodeFeedbackInputSchema,
    outputSchema: CodeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
