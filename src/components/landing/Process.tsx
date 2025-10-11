'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const processSteps = [
    {
      icon: MessageCircle,
      title: "Let's Talk",
      description: "We'll start with a friendly chat to understand your vision and project goals.",
    },
    {
      icon: Lightbulb,
      title: "Big Ideas",
      description: "I'll craft a unique strategy and creative proposal tailored just for you.",
    },
    {
      icon: PencilRuler,
      title: "Creative Design",
      description: "I'll design beautiful mockups and interactive prototypes to bring your vision to life.",
    },
    {
      icon: Code,
      title: "Magic Code",
      description: "I'll build your project with clean, efficient code using the latest tech.",
    },
    {
      icon: Combine,
      title: "Polish & Perfect",
      description: "We'll test everything to ensure a bug-free, seamless experience on all devices.",
    },
    {
      icon: Rocket,
      title: "Liftoff!",
      description: "After your final approval, we'll launch your project for the world to see.",
    },
];

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-6xl mx-auto mt-12 p-8 md:p-12 rounded-3xl bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 shadow-xl",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 bg-primary/10 rounded-full p-3">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold font-headline">{step.title}</h3>
                                        <p className="text-muted-foreground mt-1">{step.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-col justify-center space-y-8">
                         <div>
                            <h3 className="text-2xl font-bold tracking-tighter font-headline mb-6 text-center md:text-left">Let's work together</h3>
                            <p className="text-muted-foreground md:text-lg/relaxed text-center md:text-left">
                                Ready to turn your idea into a reality? Let's connect and build something amazing.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Button variant="ghost" className="w-full justify-start text-left h-auto p-4 rounded-xl hover:bg-foreground/10">
                                <a href="mailto:hello@mohamedaref.com" className="flex items-center gap-4">
                                    <Mail className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="font-semibold text-base">Email</p>
                                        <p className="text-muted-foreground text-sm">hello@mohamedaref.com</p>
                                    </div>
                                </a>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-left h-auto p-4 rounded-xl hover:bg-foreground/10">
                                <a href="tel:+1234567890" className="flex items-center gap-4">
                                    <Phone className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="font-semibold text-base">Phone</p>
                                        <p className="text-muted-foreground text-sm">+1 (234) 567-890</p>
                                    </div>
                                </a>
                            </Button>
                        </div>
                        <div className="pt-4 flex justify-center md:justify-start">
                             <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
                                <a href="#contact">Send a Message</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
