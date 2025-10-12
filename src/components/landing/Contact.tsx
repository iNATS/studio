'use client';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

const ContactForm = () => {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Contact Me</h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-xl mx-auto">
            Have a project in mind or just want to say hello? Drop me a line.
          </p>
        </div>
        <form className="grid gap-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80 dark:text-white/80">Your Name</Label>
              <Input id="name" placeholder="John Doe" className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80 dark:text-white/80">Your Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground/80 dark:text-white/80">Your Message</Label>
            <Textarea id="message" placeholder="I'd like to discuss..." rows={5} className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
          </div>
          <div className="flex justify-center sm:justify-end">
            <Button type="submit" size="lg" className="rounded-full text-base shadow-lg w-full sm:w-auto">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    );
  };

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });
  
    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function Contact() {
    return (
        <AnimatedSection id="contact" threshold={0.4}>
            <ContactForm />
        </AnimatedSection>
    )
}
