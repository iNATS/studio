'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const processSteps = [
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "1. Let's Talk",
      description: "We'll start with a friendly chat to understand your vision and project goals.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "2. Big Ideas",
      description: "I'll craft a unique strategy and creative proposal tailored just for you.",
    },
    {
      icon: <PencilRuler className="w-8 h-8 text-primary" />,
      title: "3. Creative Design",
      description: "I'll design beautiful mockups and interactive prototypes to bring your vision to life.",
    },
    {
      icon: <Code className="w-8 h-8 text-primary" />,
      title: "4. Magic Code",
      description: "I'll build your project with clean, efficient code using the latest tech.",
    },
    {
      icon: <Combine className="w-8 h-8 text-primary" />,
      title: "5. Polish & Perfect",
      description: "We'll test everything to ensure a bug-free, seamless experience on all devices.",
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "6. Liftoff!",
      description: "After your final approval, we'll launch your project for the world to see.",
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {processSteps.map((step, index) => {
                    const itemRef = useRef<HTMLDivElement>(null);
                    const itemInView = useInView(itemRef, { triggerOnce: true, threshold: 0.2 });

                    return (
                        <div ref={itemRef} key={step.title} className={cn("transition-all duration-700 ease-in-out", itemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} style={{transitionDelay: `${index * 100}ms`}}>
                            <Card className="h-full bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl hover:border-border/60 dark:hover:border-white/20 transition-all duration-300">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                        {step.icon}
                                    </div>
                                    <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
