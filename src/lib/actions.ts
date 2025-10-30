
'use server';

import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePageContent,
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
  uploadFile,
  addClient,
  updateClient,
  deleteClient,
  addTask,
  updateTask,
  deleteTask,
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
            } else {
                return { success: false, error: result.error || 'File upload failed' };
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


// Client Actions
export async function handleAddClient(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const newClientData = {
        ...values,
        avatar: `https://picsum.photos/seed/${values.name}/100/100`,
    };
    const result = await addClient(newClientData);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
    }
    return result;
}

export async function handleUpdateClient(id: string, formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const result = await updateClient(id, values);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
    }
    return result;
}

export async function handleDeleteClient(id: string) {
    const result = await deleteClient(id);
    if (result.success) {
        revalidatePath('/admin/workspace/clients');
    }
    return result;
}


// Task Actions
export async function handleAddTask(formData: FormData) {
    const values = Object.fromEntries(formData.entries());
    const result = await addTask(values);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}

export async function handleUpdateTask(id: string, formData: FormData | { [key: string]: any }) {
    const values = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;
    const result = await updateTask(id, values);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}

export async function handleDeleteTask(id: string) {
    const result = await deleteTask(id);
    if (result.success) {
        revalidatePath('/admin/workspace/tasks');
    }
    return result;
}

    