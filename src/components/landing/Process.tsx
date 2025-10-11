'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
        x: direction > 0 ? 100 : -100,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
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
                "relative w-full max-w-2xl min-h-[300px] mx-auto mt-12 flex flex-col items-center justify-center bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 rounded-2xl p-8 md:p-12",
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
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="w-full h-full flex flex-col items-center justify-center text-center"
                    >
                         <div className="p-4 bg-primary/10 rounded-full mb-6">
                            <CurrentIcon className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold font-headline mb-3">{activeStep.title}</h3>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">{activeStep.description}</p>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2 sm:px-0 sm:w-[calc(100%+4rem)]">
                    <Button variant="ghost" size="icon" onClick={() => paginate(-1)} className="rounded-full h-12 w-12 bg-background/50 hover:bg-background border border-border/50">
                        <ArrowLeft />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => paginate(1)} className="rounded-full h-12 w-12 bg-background/50 hover:bg-background border border-border/50">
                        <ArrowRight />
                    </Button>
                </div>
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                    {processSteps.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage([i, i > page ? 1 : -1])}
                        className={cn(
                            "w-2 h-2 rounded-full bg-primary/20 transition-all duration-300",
                            page === i ? "w-4 bg-primary" : "hover:bg-primary/50"
                        )}
                        aria-label={`Go to step ${i + 1}`}
                    />
                    ))}
                </div>
            </div>
        </section>
    );
};