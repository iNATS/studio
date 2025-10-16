
'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

// Mock data for testimonials
const initialTestimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Innovate Inc.',
      feedback: 'Working with Mohamed was a game-changer. His creative vision and technical expertise brought our project to life in ways we couldn\'t have imagined.',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    {
      name: 'Michael Chen',
      company: 'Tech Solutions',
      feedback: 'The mobile app he developed for us exceeded all expectations. It\'s intuitive, fast, and beautifully designed.',
      avatar: 'https://picsum.photos/seed/michael/100/100',
    },
];

// Mock data for process steps
const initialProcessSteps = [
    {
      title: "Let's Talk",
      description: "A friendly chat to understand your vision and project goals.",
    },
    {
      title: "Big Ideas",
      description: "Crafting a unique strategy and creative proposal tailored just for you.",
    },
    {
      title: "Creative Design",
      description: "Designing beautiful mockups and interactive prototypes to bring your vision to life.",
    },
];


export default function PageContentPage() {
    const [testimonials, setTestimonials] = React.useState(initialTestimonials);
    const [processSteps, setProcessSteps] = React.useState(initialProcessSteps);

    const handleTestimonialSave = (index: number, data: any) => {
        const newTestimonials = [...testimonials];
        newTestimonials[index] = data;
        setTestimonials(newTestimonials);
        toast({ title: 'Success', description: 'Testimonial updated successfully!' });
    };

    const handleAddTestimonial = () => {
        setTestimonials([...testimonials, { name: '', company: '', feedback: '', avatar: 'https://picsum.photos/seed/new/100/100' }]);
    };
    
    const handleRemoveTestimonial = (index: number) => {
        setTestimonials(testimonials.filter((_, i) => i !== index));
        toast({ title: 'Success', description: 'Testimonial removed.' });
    };
    
    const handleProcessStepSave = (index: number, data: any) => {
        const newProcessSteps = [...processSteps];
        newProcessSteps[index] = data;
        setProcessSteps(newProcessSteps);
        toast({ title: 'Success', description: 'Process step updated successfully!' });
    };
    
    const handleAddProcessStep = () => {
        setProcessSteps([...processSteps, { title: '', description: '' }]);
    };

    const handleRemoveProcessStep = (index: number) => {
        setProcessSteps(processSteps.filter((_, i) => i !== index));
        toast({ title: 'Success', description: 'Process step removed.' });
    };

  return (
    <main className="flex flex-col h-full">
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4 pt-4">
            <h1 className="text-2xl font-bold text-white">Page Content</h1>
        </div>
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-4">
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
                <CardHeader>
                <CardTitle className="text-white/90">Manage Landing Page</CardTitle>
                <CardDescription className="text-white/60">
                    Update the content for the different sections of your landing page.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    
                    <AccordionItem value="hero">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-white/80">Hero Section</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="space-y-2">
                            <Label htmlFor="hero-title" className="text-white/70">Title</Label>
                            <Input id="hero-title" defaultValue="Mohamed Aref" className="bg-white/10 border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-subtitle" className="text-white/70">Subtitle</Label>
                            <Input id="hero-subtitle" defaultValue="Creative Developer & Designer" className="bg-white/10 border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-description" className="text-white/70">Description</Label>
                            <Textarea id="hero-description" defaultValue="I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together." className="bg-white/10 border-white/20"/>
                        </div>
                        <Button className="rounded-lg">Save Hero Content</Button>
                        </form>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="about">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-white/80">About Me Section</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="space-y-2">
                            <Label htmlFor="about-title" className="text-white/70">Title</Label>
                            <Input id="about-title" defaultValue="Mohamed Aref" className="bg-white/10 border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-description" className="text-white/70">Description</Label>
                            <Textarea id="about-description" rows={4} defaultValue="I'm a passionate developer and designer with a knack for crafting elegant solutions to complex problems. I thrive on bringing ideas to life, from the initial concept all the way to a polished, performant product." className="bg-white/10 border-white/20"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-skills" className="text-white/70">Skills (comma-separated)</Label>
                            <Textarea id="about-skills" rows={3} defaultValue="UI/UX Design, Web Design, Mobile Design, Logo Design, Visual Identity, Wire-framing, Prototyping, Figma, Adobe XD, Photoshop, Illustrator, Web Development, HTML, CSS, JavaScript, Bootstrap, Tailwind, Webflow, Wordpress, Restfull API, Google maps API, AI Vibe coding, dev ops, hosting, CPanel, VPS, Shared Host" className="bg-white/10 border-white/20"/>
                        </div>
                        <Button className="rounded-lg">Save About Content</Button>
                        </form>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="process">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-white/80">Process Section</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        {processSteps.map((step, index) => (
                            <form key={index} className="space-y-3 p-3 rounded-md bg-white/5 border border-white/10 relative" onSubmit={(e) => { e.preventDefault(); handleProcessStepSave(index, Object.fromEntries(new FormData(e.currentTarget).entries())); }}>
                                <div className="space-y-2">
                                    <Label htmlFor={`process-title-${index}`} className="text-white/70">Step {index + 1} Title</Label>
                                    <Input id={`process-title-${index}`} name="title" defaultValue={step.title} className="bg-white/10 border-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`process-desc-${index}`} className="text-white/70">Description</Label>
                                    <Input id={`process-desc-${index}`} name="description" defaultValue={step.description} className="bg-white/10 border-white/20" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Button type="submit" size="sm" className="rounded-lg">Save Step</Button>
                                    <Button type="button" variant="destructive" size="icon" className="rounded-full h-7 w-7" onClick={() => handleRemoveProcessStep(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </form>
                        ))}
                        <Button onClick={handleAddProcessStep} variant="outline" className="w-full rounded-lg mt-4"><PlusCircle className="mr-2 h-4 w-4" /> Add Process Step</Button>
                        </div>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="testimonials">
                    <AccordionTrigger className="hover:no-underline text-lg font-semibold text-white/80">Testimonials Section</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                        {testimonials.map((testimonial, index) => (
                            <form key={index} className="space-y-3 p-3 rounded-md bg-white/5 border border-white/10 relative" onSubmit={(e) => { e.preventDefault(); handleTestimonialSave(index, Object.fromEntries(new FormData(e.currentTarget).entries())); }}>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-name-${index}`} className="text-white/70">Name</Label>
                                    <Input id={`testimonial-name-${index}`} name="name" defaultValue={testimonial.name} className="bg-white/10 border-white/20"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-company-${index}`} className="text-white/70">Company</Label>
                                    <Input id={`testimonial-company-${index}`} name="company" defaultValue={testimonial.company} className="bg-white/10 border-white/20"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`testimonial-feedback-${index}`} className="text-white/70">Feedback</Label>
                                    <Textarea id={`testimonial-feedback-${index}`} name="feedback" rows={3} defaultValue={testimonial.feedback} className="bg-white/10 border-white/20"/>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Button type="submit" size="sm" className="rounded-lg">Save Testimonial</Button>
                                    <Button type="button" variant="destructive" size="icon" className="rounded-full h-7 w-7" onClick={() => handleRemoveTestimonial(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </form>
                        ))}
                        <Button onClick={handleAddTestimonial} variant="outline" className="w-full rounded-lg mt-4"><PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial</Button>
                        </div>
                    </AccordionContent>
                    </AccordionItem>

                </Accordion>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
