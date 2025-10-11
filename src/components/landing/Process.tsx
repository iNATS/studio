'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.2 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4">
            <div className={cn("text-center mb-16 sm:mb-20", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-card/40 dark:bg-white/5 backdrop-blur-2xl border border-border/30 dark:border-white/10 shadow-xl",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-4">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            const isHovered = hoveredIndex === index;
                            return (
                                <div
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    className={cn(
                                        "p-4 rounded-xl transition-all duration-300 cursor-pointer",
                                        isHovered ? 'bg-primary/10' : 'bg-transparent hover:bg-primary/5'
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-3 rounded-full transition-colors duration-300", isHovered ? 'bg-primary/20' : 'bg-foreground/5')}>
                                            <Icon className={cn("w-6 h-6 transition-colors duration-300", isHovered ? 'text-primary' : 'text-foreground/70')} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold font-headline text-lg">{step.title}</h4>
                                            <div
                                                style={{
                                                    maxHeight: isHovered ? '100px' : '0',
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out 0.1s'
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-foreground/5 dark:bg-white/5 rounded-2xl border border-border/20 dark:border-white/10">
                        <h3 className="font-bold tracking-tighter font-headline text-2xl mb-4">Let's work together</h3>
                        <p className="text-muted-foreground mb-8">
                            Ready to start your next project? I'm excited to hear your ideas.
                        </p>
                        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg w-full max-w-xs">
                                <Link href="#contact">
                                    Let's Talk
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
