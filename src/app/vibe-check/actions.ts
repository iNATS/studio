'use server';

import { codeFeedback, CodeFeedbackInput } from '@/ai/flows/code-feedback';
import { videoEditFeedback, VideoEditFeedbackInput } from '@/ai/flows/video-edit-feedback';
import { z } from 'zod';

const codeSchema = z.object({
  code: z.string().min(10, { message: 'Code must be at least 10 characters long.' }),
  language: z.string().optional(),
});

export async function getCodeFeedback(prevState: any, formData: FormData) {
  const validatedFields = codeSchema.safeParse({
    code: formData.get('code'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      feedback: null,
    };
  }

  try {
    const result = await codeFeedback(validatedFields.data as CodeFeedbackInput);
    return { message: 'Success', feedback: result.feedback, errors: null };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while getting feedback.', feedback: null, errors: null };
  }
}

const videoSchema = z.object({
  videoDataUri: z.string().startsWith('data:video', { message: 'Please upload a valid video file.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
});

export async function getVideoFeedback(prevState: any, formData: FormData) {
  const validatedFields = videoSchema.safeParse({
    videoDataUri: formData.get('videoDataUri'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      feedback: null,
    };
  }

  try {
    const result = await videoEditFeedback(validatedFields.data as VideoEditFeedbackInput);
    return { message: 'Success', feedback: result.feedback, errors: null };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while getting feedback.', feedback: null, errors: null };
  }
}
