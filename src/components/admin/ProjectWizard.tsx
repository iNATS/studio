
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
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
import type { PortfolioItem } from '../landing/Portfolio';
import { Upload, File as FileIcon, X, ArrowLeft, ArrowRight, Send, Rocket, GalleryHorizontal, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '../ui/badge';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5000000; // 5MB

const stepSchemas = [
  z.object({
    title: z.string().min(2, 'Title must be at least 2 characters.'),
    slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
    description: z.string().min(10, 'Description is too short.'),
    fullDescription: z.string().min(20, 'Full description is too short.'),
  }),
  z.object({
    imageFile: z.any()
        .refine((file) => file, "Main image is required.")
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),"Only .jpg, .jpeg, .png and .webp formats are supported."),
    screenshotFiles: z.any()
        .refine((files) => files ? Array.from(files).every((file: any) => file.size <= MAX_IMAGE_SIZE) : true, `Max image size is 5MB.`)
        .refine((files) => files ? Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type)) : true, "Only .jpg, .jpeg, .png and .webp formats are supported.")
        .optional(),
    link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  }),
  z.object({
    category: z.enum(['web', 'mobile', 'design']),
    tags: z.string().min(1, 'Please add at least one tag.'),
  }),
  z.object({})
];


interface ProjectWizardProps {
  project?: Omit<PortfolioItem, 'id' | 'image' | 'screenshots' | 'tags' | 'hint'> & {
    tags: string;
    imageFile?: File;
    screenshotFiles?: FileList;
  };
  onSubmit: (values: any) => Promise<void>;
}


const FileUploadPreview = ({ file, onRemove }: { file: File, onRemove: () => void }) => (
    <div className="p-2 mt-2 bg-black/5 dark:bg-white/10 rounded-md flex items-center justify-between text-sm text-zinc-700 dark:text-white/80">
        <div className="flex items-center gap-2 overflow-hidden">
            <FileIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={onRemove}>
            <X className="h-4 w-4" />
        </Button>
    </div>
)

const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: number }) => (
    <div className="flex justify-center items-center gap-3 mb-8">
      {Array.from({ length: steps }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'h-2 rounded-full bg-zinc-300 dark:bg-white/20 transition-all duration-300',
            index === currentStep ? 'w-6 bg-foreground dark:bg-white' : 'w-2'
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );

export function ProjectWizard({ project, onSubmit }: ProjectWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(project || {
        title: '',
        slug: '',
        description: '',
        fullDescription: '',
        category: 'web',
        tags: '',
        imageFile: undefined,
        link: '',
        screenshotFiles: undefined,
    });
    
    const isEditing = !!project;

    // Use a different schema for editing to make file inputs optional
    const editStepSchemas = [
        stepSchemas[0],
        stepSchemas[1].extend({
            imageFile: stepSchemas[1].shape.imageFile.optional(),
        }),
        stepSchemas[2],
        stepSchemas[3],
    ];

    const currentSchemas = isEditing ? editStepSchemas : stepSchemas;

    const form = useForm({
        resolver: zodResolver(currentSchemas[currentStep]),
        defaultValues: formData,
        mode: "onChange",
    });
  
  const watchedValues = form.watch();

  useEffect(() => {
    setFormData(prev => ({...prev, ...watchedValues}))
  }, [watchedValues]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const screenshotsRef = form.register("screenshotFiles");

  const processStep = async () => {
    const isStepValid = await form.trigger();
    if (!isStepValid) return;
    
    setFormData(prev => ({ ...prev, ...form.getValues() }));

    if (currentStep < currentSchemas.length - 1) {
        setDirection(1);
        setCurrentStep(step => step + 1);
    } else {
      await handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
        setDirection(-1);
        setCurrentStep(step => step - 1);
    }
  }
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };
  
  const ImagePreview = ({file, className, fill, alt}: {file: File, className?: string, fill?: boolean, alt?: string}) => {
    const [preview, setPreview] = useState<string | null>(null);
    useEffect(() => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [file]);

    if (!preview) return <div className={cn("bg-black/10 dark:bg-white/10 animate-pulse", className)} />;
    
    if (fill) {
        return <Image src={preview} alt={alt || "preview"} fill className={cn("object-cover", className)} />
    }

    return <Image src={preview} alt={alt || "preview"} width={200} height={112} className={cn("aspect-video w-full object-cover", className)} />
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit()}} className="space-y-6">
        <StepIndicator currentStep={currentStep} steps={currentSchemas.length} />

        <div className="overflow-hidden relative h-[450px] p-1">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute w-full h-full px-1"
                >
                    {currentStep === 0 && (
                        <div className="space-y-4 px-1">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g., E-commerce Platform" {...field} className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
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
                                        <Input placeholder="e-commerce-platform" {...field} className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                                    </FormControl>
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
                                        placeholder="A short summary of the work..."
                                        rows={2}
                                        {...field}
                                        className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10"
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
                                        placeholder="The full, detailed description of the work..."
                                        rows={3}
                                        {...field}
                                        className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                    {currentStep === 1 && (
                         <div className="space-y-4 px-1">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField
                                    control={form.control}
                                    name="imageFile"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Main Image</FormLabel>
                                            <FormControl>
                                                <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-300 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:border-zinc-400 dark:hover:border-white/40 transition-colors">
                                                    <div className="text-center">
                                                        <Upload className="mx-auto h-8 w-8 text-zinc-500 dark:text-white/50" />
                                                        <p className="mt-2 text-sm text-zinc-600 dark:text-white/60">Click or drag to upload</p>
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
                                    name="screenshotFiles"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Screenshots</FormLabel>
                                            <FormControl>
                                                <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-300 dark:border-white/20 bg-black/5 dark:bg-white/5 hover:border-zinc-400 dark:hover:border-white/40 transition-colors">
                                                    <div className="text-center">
                                                    <Upload className="mx-auto h-8 w-8 text-zinc-500 dark:text-white/50" />
                                                    <p className="mt-2 text-sm text-zinc-600 dark:text-white/60">Upload one or more files</p>
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
                                        <Input placeholder="https://..." {...field} className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                     {currentStep === 2 && (
                         <div className="space-y-4 px-1">
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
                                        <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
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
                                        <Input placeholder="React, Node.js, Figma" {...field} className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10"/>
                                    </FormControl>
                                    <FormDescription>
                                        Comma-separated list of tags.
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                     )}
                     {currentStep === 3 && (
                        <div className="text-foreground dark:text-white/90 overflow-y-auto h-full">
                            <h3 className="text-lg font-semibold text-center mb-4">Review &amp; Publish</h3>
                            <div className="bg-black/5 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 rounded-lg overflow-hidden">
                                <div className="relative w-full h-48">
                                    {formData.imageFile ? <ImagePreview file={formData.imageFile} alt={formData.title} fill /> : (project?.image ? <Image src={project.image} alt={project.title} fill className="object-cover" /> : <div className="w-full h-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-white/50">No Image</div>)}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h1 className="text-2xl font-bold text-white shadow-2xl">{formData.title}</h1>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="prose prose-sm max-w-none text-zinc-700 dark:text-white/80 dark:prose-invert">
                                        <p>{formData.fullDescription}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-zinc-600 dark:text-white/70 border-zinc-300 dark:border-white/20">{formData.category}</Badge>
                                        {formData.tags?.split(',').map(tag => tag.trim() && <Badge key={tag} variant="secondary" className="bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-white/80">{tag.trim()}</Badge>)}
                                    </div>

                                    {formData.screenshotFiles && formData.screenshotFiles.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2"><GalleryHorizontal className="h-4 w-4"/> Screenshots</h5>
                                            <div className="grid grid-cols-3 gap-2">
                                                {Array.from(formData.screenshotFiles).map((file: any, index) => (
                                                    <div key={index} className="relative aspect-video rounded-md overflow-hidden border border-zinc-200/80 dark:border-white/10">
                                                      <ImagePreview file={file} alt={`Screenshot ${index+1}`} fill />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                     )}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0 || isSubmitting} className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={processStep} size="lg" className="rounded-full" disabled={isSubmitting}>
            {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : currentStep === currentSchemas.length - 1 ? (
                <>Publish Work <Rocket className="ml-2 h-4 w-4" /></>
            ) : currentStep === currentSchemas.length - 2 ? (
                <>Review <Send className="ml-2 h-4 w-4" /></>
            ) : (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
            </Button>
        </div>
      </form>
    </FormProvider>
  );
}
