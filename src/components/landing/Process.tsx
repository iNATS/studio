'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket } from 'lucide-react';


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
    const timelineRef = useRef<HTMLDivElement>(null);
    const [lineHeight, setLineHeight] = useState(0);

    useEffect(() => {
        if (inView && timelineRef.current) {
            const handleScroll = () => {
                if (!timelineRef.current) return;
                const timelineRect = timelineRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                const startPoint = viewportHeight * 0.2;
                const endPoint = viewportHeight * 0.8; 
                
                const scrollableHeight = timelineRect.height - (endPoint - startPoint);
                
                let scrollFraction = 0;
                if (timelineRect.top < startPoint && timelineRect.bottom > endPoint) {
                    scrollFraction = Math.min(1, (startPoint - timelineRect.top) / scrollableHeight);
                } else if (timelineRect.top >= startPoint) {
                    scrollFraction = 0;
                } else {
                    scrollFraction = 1;
                }

                setLineHeight(scrollFraction * 100);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();

            return () => window.removeEventListener('scroll', handleScroll);
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
            <div ref={timelineRef} className="relative max-w-3xl mx-auto flex flex-col items-center">
                <div className="absolute left-9 md:left-1/2 top-0 h-full w-0.5 bg-border/50 -translate-x-1/2" aria-hidden="true">
                    <div
                        className="absolute top-0 w-full bg-primary transition-all duration-100 ease-linear"
                        style={{ height: `${lineHeight}%` }}
                    />
                </div>
                {processSteps.map((step, index) => {
                    const itemRef = useRef<HTMLDivElement>(null);
                    const itemInView = useInView(itemRef, { triggerOnce: false, threshold: 0.5 });
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={step.title}
                            ref={itemRef}
                            className={cn(
                                "relative mb-12 flex w-full items-start",
                                "md:w-1/2",
                                isEven ? "md:pr-8 md:self-start" : "md:pl-8 md:self-end"
                            )}
                        >
                             <div className="absolute top-0 -translate-y-1/2 left-0 w-full md:hidden">
                                <div className="absolute left-9 -translate-x-1/2 ">
                                    <div
                                        className={cn(
                                            "w-5 h-5 rounded-full transition-colors duration-500",
                                            itemInView ? "bg-primary" : "bg-border"
                                        )}
                                    />
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "hidden md:flex absolute top-0 items-center justify-center w-14 h-14 rounded-full transition-all duration-500 -translate-y-1/2",
                                    "bg-card/60 backdrop-blur-xl border",
                                    itemInView ? "border-primary/80 shadow-lg shadow-primary/20" : "border-border/50 dark:border-white/10",
                                    isEven ? "right-0 translate-x-[50%]" : "left-0 -translate-x-[50%]"
                                )}
                            >
                               {step.icon}
                            </div>
                            <div
                                className={cn(
                                    "pl-16 w-full transition-all duration-700 md:pl-0",
                                    isEven ? "md:text-right" : "md:text-left",
                                    itemInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                )}
                            >
                                <h3 className="text-2xl font-bold font-headline mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
