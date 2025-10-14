'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PortfolioItem } from '../landing/Portfolio';
import { Upload, File as FileIcon, X } from 'lucide-react';
import React from 'react';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  description: z.string().min(10, 'Description is too short.'),
  fullDescription: z.string().min(20, 'Full description is too short.'),
  category: z.enum(['web', 'mobile', 'design']),
  tags: z.string().min(1, 'Please add at least one tag.'),
  image: z.any()
    .refine((file) => file, "Main image is required.")
    .refine((file) => file?.size <= 5000000, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  screenshots: z.any()
    .refine((files) => files?.length > 0 ? Array.from(files).every((file: any) => file.size <= 5000000) : true, `Max image size is 5MB.`)
    .refine(
        (files) => files?.length > 0 ? Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type)) : true,
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Omit<PortfolioItem, 'image' | 'screenshots' | 'tags'> & {
    tags: string;
    image: any;
    screenshots: any;
  };
  onSubmit: (values: ProjectFormValues) => void;
}


const FileUploadPreview = ({ file, onRemove }: { file: File, onRemove: () => void }) => (
    <div className="p-2 mt-2 bg-white/10 rounded-md flex items-center justify-between text-sm text-white/80">
        <div className="flex items-center gap-2 overflow-hidden">
            <FileIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={onRemove}>
            <X className="h-4 w-4" />
        </Button>
    </div>
)

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: project || {
      title: '',
      slug: '',
      description: '',
      fullDescription: '',
      category: 'web',
      tags: '',
      image: undefined,
      link: '',
      screenshots: undefined,
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    onSubmit(values);
  };
  
  const screenshotsRef = form.register("screenshots");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="E.g., E-commerce Platform" {...field} className="bg-white/5 border-white/10" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                    <Input placeholder="e-commerce-platform" {...field} className="bg-white/5 border-white/10" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short summary of the project..."
                  {...field}
                  className="bg-white/5 border-white/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The full, detailed description of the project..."
                  rows={5}
                  {...field}
                  className="bg-white/5 border-white/10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                    <Input placeholder="React, Node.js, Figma" {...field} className="bg-white/5 border-white/10"/>
                </FormControl>
                <FormDescription>
                    Comma-separated list of tags.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Main Image</FormLabel>
                         <FormControl>
                            <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-white/20 bg-white/5 hover:border-white/40 transition-colors">
                                <div className="text-center">
                                    <Upload className="mx-auto h-8 w-8 text-white/50" />
                                    <p className="mt-2 text-sm text-white/60">Click or drag to upload</p>
                                </div>
                                <Input type="file" className="sr-only" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                            </label>
                         </FormControl>
                         {value && <FileUploadPreview file={value} onRemove={() => onChange(null)} />}
                         <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="screenshots"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Screenshots</FormLabel>
                        <FormControl>
                            <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-white/20 bg-white/5 hover:border-white/40 transition-colors">
                                <div className="text-center">
                                <Upload className="mx-auto h-8 w-8 text-white/50" />
                                <p className="mt-2 text-sm text-white/60">Upload one or more files</p>
                                </div>
                                <Input type="file" multiple className="sr-only" {...screenshotsRef} onChange={(e) => onChange(e.target.files)} />
                            </label>
                        </FormControl>
                        {value && Array.from(value).map((file: any, index: number) => (
                           <FileUploadPreview 
                           key={index} 
                           file={file} 
                           onRemove={() => {
                               const newFiles = new DataTransfer();
                               const currentFiles = Array.from(value);
                               currentFiles.splice(index, 1);
                               currentFiles.forEach((f: any) => newFiles.items.add(f));
                               onChange(newFiles.files.length > 0 ? newFiles.files : null);
                           }} 
                       />
                        ))}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live Site URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="rounded-full">
            {project ? 'Save Changes' : 'Create Project'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
