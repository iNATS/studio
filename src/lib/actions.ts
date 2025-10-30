'use server';

import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePageContent,
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
  uploadFile
} from './db';
import { revalidatePath } from 'next/cache';

export async function handleAddWork(values: any) {
    const result = await addPortfolioItem(values);
    if(result.success) {
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
    }
    return result;
}

export async function handleEditWork(id: number, values: any) {
    const result = await updatePortfolioItem(id, values);
     if(result.success) {
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
    }
    return result;
}

export async function handleDeleteWork(id: number) {
    const result = await deletePortfolioItem(id);
     if(result.success) {
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
    }
    return result;
}

export async function handlePageContentSave(section: string, formData: FormData) {
    let content: any = {};

    if (section === 'about') {
        const avatarFile = formData.get('avatar') as File;
        let avatarUrl = formData.get('currentAvatar') as string;

        if (avatarFile && avatarFile.size > 0) {
            const result = await uploadFile(avatarFile);
            if (result.path) {
                avatarUrl = result.path;
            }
        }
        content = {
            title: formData.get('about-title'),
            description: formData.get('about-description'),
            skills: (formData.get('about-skills') as string).split(',').map(s => s.trim()),
            avatar: avatarUrl
        };
    } else {
       content = Object.fromEntries(formData.entries());
    }
    
    const result = await updatePageContent(section, content);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleTestimonialSave(id: number, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const result = await updateTestimonial(id, data);
     if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleAddTestimonial() {
    const newTestimonial = { 
        name: 'New Testimonial', 
        company: 'Company', 
        feedback: 'Enter feedback here.', 
        avatar: 'https://picsum.photos/seed/new/100/100' 
    };
    const result = await addTestimonial(newTestimonial);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleRemoveTestimonial(id: number) {
    const result = await removeTestimonial(id);
    if(result.success) {
        revalidatePath('/admin/portfolio/page-content');
        revalidatePath('/');
    }
    return result;
}

export async function handleContactForm(prevState: any, formData: FormData) {
    // Here you would typically handle the form submission, e.g., send an email.
    // For this example, we'll just simulate a success response.
    console.log('Contact form submitted with:', Object.fromEntries(formData.entries()));
    return { success: true, message: "Thanks for reaching out. I'll get back to you soon." };
}
