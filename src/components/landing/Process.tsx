'use client';

import { useRef, useState } from 'react';
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

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });
    const [activeStep, setActiveStep] = useState(0);

    const CurrentIcon = processSteps[activeStep].icon;

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-8 md:gap-12",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>
                <div className="md:col-span-1 flex flex-col gap-2">
                    {processSteps.map((step, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveStep(index)}
                            onMouseEnter={() => setActiveStep(index)}
                            className={cn(
                                "w-full text-left p-4 rounded-lg transition-colors duration-300 text-foreground/70",
                                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                                activeStep === index ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-primary/5'
                            )}
                        >
                           {step.title}
                        </button>
                    ))}
                </div>
                
                <div className="md:col-span-2 relative min-h-[200px] bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 rounded-2xl p-8 md:p-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <CurrentIcon className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2">{processSteps[activeStep].title}</h3>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto">{processSteps[activeStep].description}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
