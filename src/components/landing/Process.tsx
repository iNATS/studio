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
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start center', 'end center']
    });

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
             <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>
            
            <div className="relative w-full max-w-5xl mx-auto h-48">
                {/* Roadmap Track */}
                <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-foreground/10 rounded-full">
                     <motion.div 
                        className="h-full bg-primary/80 rounded-full shadow-[0_0_15px_hsl(var(--primary))]"
                        style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
                     />
                </div>
                
                {/* Roadmap Steps */}
                <div className="relative flex justify-between items-center w-full h-full">
                    {processSteps.map((step, index) => {
                        const Icon = step.icon;
                        const progress = useTransform(scrollYProgress, [index / (processSteps.length -1) - 0.1, index / (processSteps.length -1)], [0, 1]);

                        return (
                            <div key={index} className="relative flex flex-col items-center group">
                                <motion.div 
                                    style={{ scale: progress, opacity: progress }}
                                    className="flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary/50 cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:border-primary"
                                >
                                    <Icon className="w-6 h-6 text-primary/80 transition-all duration-300 group-hover:text-primary" />
                                </motion.div>
                                <motion.div 
                                    style={{opacity: progress}}
                                    className="text-center mt-4 w-40"
                                >
                                    <h3 className="font-bold text-sm font-headline text-foreground">{step.title}</h3>
                                    <p className="text-muted-foreground text-xs mt-1">{step.description}</p>
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
