'use client';

import { useState, useEffect, useRef } from 'react';
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
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (inView) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % processSteps.length);
            }, 3000); // Change step every 3 seconds
            return () => clearInterval(interval);
        }
    }, [inView]);

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4">
             <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn("relative max-w-2xl mx-auto h-48 flex items-center justify-center", inView ? 'animate-fade-in-up animation-delay-200' : 'opacity-0')}>
                {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={index}
                            className={cn(
                                "absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-1000",
                                activeIndex === index ? 'opacity-100' : 'opacity-0'
                            )}
                        >
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2 text-foreground dark:text-white">{step.title}</h3>
                            <p className="text-muted-foreground text-lg">{step.description}</p>
                        </div>
                    );
                })}
            </div>
            
            <div className={cn("mt-16 text-center", inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0')}>
                <Button asChild className="bg-white/10 text-white/90 hover:bg-white/20 rounded-full text-base backdrop-blur-sm border border-white/20">
                    <Link href="#contact">
                        Let's Talk
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </section>
    );
};
