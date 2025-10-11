'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket } from 'lucide-react';

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
    const [hoveredStep, setHoveredStep] = useState<number | null>(1); // Default to first step
    const [activeStep, setActiveStep] = useState<number>(1);

    const handleStepInteraction = (index: number) => {
      setHoveredStep(index);
      setActiveStep(index);
    }
    
    const currentStep = hoveredStep !== null ? processSteps[hoveredStep] : null;

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn("relative w-full max-w-5xl mx-auto mt-24", inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0')}>
                {/* Timeline Track */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-white/10">
                   <div className="h-full bg-primary/50" style={{ width: `${(activeStep / (processSteps.length -1 )) * 100}%`, transition: 'width 0.5s ease-in-out' }} />
                </div>
                
                {/* Timeline Steps */}
                <div className="relative flex justify-between">
                    {processSteps.map((step, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center"
                            onMouseEnter={() => handleStepInteraction(index)}
                            onClick={() => handleStepInteraction(index)}
                        >
                            <div className={cn(
                                "z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer",
                                "bg-background/80 backdrop-blur-sm",
                                activeStep >= index ? "border-primary/80 shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" : "border-border/50",
                                hoveredStep === index ? "scale-110" : ""
                            )}>
                                <step.icon className={cn("w-6 h-6 transition-colors duration-300", activeStep >= index ? "text-primary": "text-muted-foreground")} />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Display Area */}
                <div className="relative mt-16 min-h-[120px] px-4">
                    <div className={cn(
                        "text-center transition-opacity duration-500",
                        currentStep ? 'opacity-100' : 'opacity-0'
                    )}>
                        {currentStep && (
                            <>
                                <h3 className="text-2xl font-bold font-headline">{currentStep.title}</h3>
                                <p className="mt-2 text-lg text-muted-foreground max-w-lg mx-auto">{currentStep.description}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};