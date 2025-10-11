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


const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });

  return (
    <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
      {children}
    </section>
  )
}

export function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    return (
        <AnimatedSection id="process" threshold={0.1}>
            <div ref={sectionRef} className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                    <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                        A streamlined journey from a spark of an idea to a stunning final product.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 w-0.5 h-full bg-border/40 origin-top">
                        <motion.div 
                            className="bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                            style={{ 
                                scaleY: useTransform(scrollYProgress, [0.2, 0.9], [0, 1]),
                                originY: 0
                            }}
                        />
                    </div>
                    
                    <div className="space-y-12">
                        {processSteps.map((step, index) => {
                            const Icon = step.icon;
                            const stepRef = useRef<HTMLDivElement>(null);
                            const stepInView = useInView(stepRef, { triggerOnce: true, threshold: 0.5 });
                            
                            return (
                                <div key={index} ref={stepRef} className={cn("relative flex items-start gap-6 transition-opacity duration-700", stepInView ? 'opacity-100' : 'opacity-0')}>
                                    <div className={cn(
                                        "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors duration-500",
                                        stepInView ? "border-primary" : "border-border/40"
                                    )}>
                                        <Icon className={cn("h-4 w-4 transition-colors duration-500", stepInView ? "text-primary" : "text-muted-foreground")} />
                                    </div>
                                    <div className={cn("transform transition-all duration-700 delay-150", stepInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                                        <h3 className="font-bold text-lg font-headline text-foreground">{step.title}</h3>
                                        <p className="mt-1 text-muted-foreground">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-16 text-center">
                  <Button asChild className="bg-white/10 text-white/90 hover:bg-white/20 rounded-full text-base backdrop-blur-sm border border-white/20">
                      <Link href="#contact">
                          Let's Talk
                          <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                </div>
            </div>
        </AnimatedSection>
    );
};
