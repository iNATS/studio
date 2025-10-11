'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const processSteps = [
    {
      icon: MessageCircle,
      title: "1. Let's Talk",
      description: "We'll start with a friendly chat to understand your vision and project goals.",
    },
    {
      icon: Lightbulb,
      title: "2. Big Ideas",
      description: "I'll craft a unique strategy and creative proposal tailored just for you.",
    },
    {
      icon: PencilRuler,
      title: "3. Creative Design",
      description: "I'll design beautiful mockups and interactive prototypes to bring your vision to life.",
    },
    {
      icon: Code,
      title: "4. Magic Code",
      description: "I'll build your project with clean, efficient code using the latest tech.",
    },
    {
      icon: Combine,
      title: "5. Polish & Perfect",
      description: "We'll test everything to ensure a bug-free, seamless experience on all devices.",
    },
    {
      icon: Rocket,
      title: "6. Liftoff!",
      description: "After your final approval, we'll launch your project for the world to see.",
    },
  ];

const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? 30 : -30,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        y: direction < 0 ? 30 : -30,
        opacity: 0,
      };
    },
  };

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        setPage([(page + newDirection + processSteps.length) % processSteps.length, newDirection]);
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            paginate(1);
        }, 3000);
        return () => clearInterval(interval);
    }, [page]);

    const activeStep = processSteps[page];
    const CurrentIcon = activeStep.icon;

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-2xl min-h-[250px] mx-auto mt-12 flex flex-col items-center justify-center",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            y: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.5 }
                        }}
                        className="absolute w-full h-full flex flex-col items-center justify-center text-center"
                    >
                         <div className="p-4 bg-primary/10 rounded-full mb-6">
                            <CurrentIcon className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold font-headline mb-3">{activeStep.title}</h3>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">{activeStep.description}</p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};
