'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, Mail, Phone } from 'lucide-react';
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

const getStepPosition = (index: number, total: number) => {
    const angle = (index / total) * 360;
    const radius = 50; // percentage
    const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
    return {
        top: `${50 + y}%`,
        left: `${50 + x}%`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    };
};

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: true, threshold: 0.3 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section ref={sectionRef} id="process" className="py-24 sm:py-32 px-4 overflow-hidden">
            <div className={cn("text-center mb-16 sm:mb-24", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>

            <div className={cn(
                "relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl aspect-square mx-auto",
                inView ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
            )}>

                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] md:w-[40%] md:h-[40%] flex items-center justify-center">
                    <div className={cn(
                        "w-full h-full rounded-full bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 shadow-xl flex flex-col items-center justify-center p-4 text-center transition-all duration-300",
                        hoveredIndex !== null ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
                    )}>
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
                    const position = getStepPosition(index, processSteps.length);
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="group absolute"
                            style={isHovered ? {
                                top: '50%',
                                left: '50%',
                                width: '60%',
                                height: 'auto',
                                zIndex: 10,
                                transform: 'translate(-50%, -50%)',
                                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                            } : {
                                ...position,
                                width: '80px',
                                height: '80px',
                                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                             <div className={cn(
                                "absolute inset-0 rounded-full bg-card/60 dark:bg-white/10 backdrop-blur-2xl border border-border/40 dark:border-white/10 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300",
                                isHovered ? 'rounded-2xl opacity-0' : 'rounded-full opacity-100'
                             )}>
                                <Icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" style={{ transform: `rotate(-${getStepPosition(index, processSteps.length).transform.match(/rotate\((.+)deg\)/)?.[1]}deg)` }} />
                            </div>

                            <div className={cn(
                                "relative w-full h-full rounded-2xl bg-card/40 dark:bg-white/5 backdrop-blur-2xl border border-border/30 dark:border-white/10 shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-center p-6",
                                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                            )}>
                                <div className="p-3 bg-primary/10 rounded-full mb-3">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="font-semibold font-headline text-lg">{step.title}</h4>
                                <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
