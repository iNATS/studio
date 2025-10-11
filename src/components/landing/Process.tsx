'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
             <div className={cn("text-center mb-24", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>
            
            <div className="relative w-full max-w-5xl mx-auto">
                {/* Vertical Roadmap Track */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-foreground/10 rounded-full">
                     <motion.div 
                        className="w-full bg-primary/80 rounded-full shadow-[0_0_15px_hsl(var(--primary))]"
                        style={{ height: useTransform(scrollYProgress, [0, 0.8], ['0%', '100%']) }}
                     />
                </div>
                
                {/* Roadmap Steps */}
                <div className="relative flex flex-col items-center w-full space-y-32">
                    {processSteps.map((step, index) => {
                        const Icon = step.icon;
                        const progress = useTransform(scrollYProgress, [(index / processSteps.length) * 0.8, (index / processSteps.length) * 0.8 + 0.1], [0, 1]);
                        const isEven = index % 2 === 0;

                        return (
                            <div key={index} className="relative flex items-center w-full">
                                <motion.div 
                                    style={{ scale: progress, opacity: progress }}
                                    className={cn("absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-background border-4 border-primary/50 cursor-pointer transition-all duration-300 ")}
                                >
                                    <Icon className="w-8 h-8 text-primary/80 transition-all duration-300" />
                                </motion.div>
                                <motion.div 
                                    style={{opacity: progress, x: useTransform(progress, [0, 1], [isEven ? -30 : 30, 0])}}
                                    className={cn("w-[calc(50%-4rem)] p-6 rounded-2xl bg-black/20 dark:bg-black/30 backdrop-blur-xl border border-white/10 shadow-xl", isEven ? "mr-auto" : "ml-auto")}
                                >
                                    <h3 className={cn("font-bold text-lg font-headline text-white", isEven ? 'text-right' : 'text-left')}>{step.title}</h3>
                                    <p className={cn("text-white/70 text-sm mt-2", isEven ? 'text-right' : 'text-left')}>{step.description}</p>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={cn("mt-24 text-center", inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0')}>
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