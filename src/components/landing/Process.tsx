'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const processSteps = [
    {
      icon: MessageCircle,
      title: "Let's Talk",
      description: "A friendly chat to understand your vision and project goals.",
    },
    {
      icon: Lightbulb,
      title: "Big Ideas",
      description: "Crafting a unique strategy and creative proposal tailored just for you.",
    },
    {
      icon: PencilRuler,
      title: "Creative Design",
      description: "Designing beautiful mockups and interactive prototypes to bring your vision to life.",
    },
    {
      icon: Code,
      title: "Magic Code",
      description: "Building your project with clean, efficient code using the latest tech.",
    },
    {
      icon: Combine,
      title: "Polish & Perfect",
      description: "Testing for a bug-free, seamless experience on all devices.",
    },
    {
      icon: Rocket,
      title: "Liftoff!",
      description: "Launching your project for the world to see.",
    },
];

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.1 });

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4">
             <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto", inView ? 'animate-fade-in-up animation-delay-200' : 'opacity-0')}>
                {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={index}
                            className="group p-6 rounded-3xl bg-card/40 dark:bg-white/5 backdrop-blur-2xl border border-border/30 dark:border-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-border/60 dark:hover:border-white/20"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 transition-all duration-300 group-hover:bg-primary/20">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold font-headline mb-2 text-foreground dark:text-white">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    );
                })}
            </div>
            
            <div className={cn("mt-16 text-center", inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0')}>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
                    <Link href="#contact">
                        Let's Talk
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
};
