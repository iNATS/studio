'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const processSteps = [
    {
      icon: MessageCircle,
      title: "Let's Talk",
      description: "A friendly chat to understand your vision.",
    },
    {
      icon: Lightbulb,
      title: "Big Ideas",
      description: "Crafting a unique strategy and creative proposal.",
    },
    {
      icon: PencilRuler,
      title: "Creative Design",
      description: "Designing beautiful mockups and prototypes.",
    },
    {
      icon: Code,
      title: "Magic Code",
      description: "Building your project with clean, efficient code.",
    },
    {
      icon: Combine,
      title: "Polish & Perfect",
      description: "Testing for a bug-free, seamless experience.",
    },
    {
      icon: Rocket,
      title: "Liftoff!",
      description: "Launching your project for the world to see.",
    },
];

const stepPositions = [
    { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }, // Top
    { top: '25%', left: '88%', transform: 'translate(-50%, -50%)' }, // Top-right
    { top: '75%', left: '88%', transform: 'translate(-50%, -50%)' }, // Bottom-right
    { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' }, // Bottom
    { top: '75%', left: '12%', transform: 'translate(-50%, -50%)' }, // Bottom-left
    { top: '25%', left: '12%', transform: 'translate(-50%, -50%)' }, // Top-left
];


export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.3 });

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-lg md:max-w-2xl lg:max-w-3xl aspect-square mx-auto",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>

                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] md:w-[40%] md:h-[40%] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 shadow-xl flex flex-col items-center justify-center p-4 text-center">
                        <h3 className="font-bold tracking-tighter font-headline text-lg md:text-xl lg:text-2xl mb-2 md:mb-4">Let's work together</h3>
                        <div className="flex gap-4 md:gap-6">
                            <Button asChild variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10">
                                <a href="mailto:hello@mohamedaref.com" aria-label="Email me">
                                    <Mail className="w-6 h-6 text-primary" />
                                </a>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10">
                                <a href="tel:+1234567890" aria-label="Call me">
                                    <Phone className="w-6 h-6 text-primary" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Radial Steps */}
                {processSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={index}
                            className="group absolute w-40 h-40 md:w-48 md:h-48"
                            style={{ ...stepPositions[index] }}
                        >
                            <div className={cn(
                                "absolute inset-0 rounded-2xl bg-card/40 dark:bg-white/5 backdrop-blur-2xl border border-border/30 dark:border-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-border/50 dark:group-hover:border-white/20 p-4 flex flex-col items-center justify-center text-center",
                                inView ? 'animate-fade-in-up' : 'opacity-0'
                            )} style={{ animationDelay: `${200 + index * 100}ms`}}>
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                </div>
                                <h4 className="font-semibold font-headline text-sm md:text-base">{step.title}</h4>
                                <p className="text-muted-foreground text-xs md:text-sm mt-1">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
