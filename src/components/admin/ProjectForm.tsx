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

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.'),
  description: z.string().min(10, 'Description is too short.'),
  fullDescription: z.string().min(20, 'Full description is too short.'),
  category: z.enum(['web', 'mobile', 'design']),
  tags: z.string().min(1, 'Please add at least one tag.'),
  image: z.string().url('Please enter a valid URL.'),
  link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  screenshots: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: PortfolioItem;
  onSubmit: (values: ProjectFormValues) => void;
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...project,
      tags: project?.tags.join(', '),
      screenshots: project?.screenshots.join('\n'),
    } || {
      title: '',
      slug: '',
      description: '',
      fullDescription: '',
      category: 'web',
      tags: '',
      image: '',
      link: '',
      screenshots: '',
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <FormDescription>
                This is the URL-friendly version of the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} className="bg-white/5 border-white/10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
         <FormField
          control={form.control}
          name="screenshots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot URLs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="One URL per line..."
                  rows={4}
                  {...field}
                  className="bg-white/5 border-white/10"
                />
              </FormControl>
               <FormDescription>
                    Each URL should be on a new line.
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {project ? 'Save Changes' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
