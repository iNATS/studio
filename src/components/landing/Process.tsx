'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { MessageCircle, Lightbulb, PencilRuler, Code, Combine, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const processSteps = [
    {
      icon: MessageCircle,
      title: "Let's Talk",
      description: "A friendly chat to understand your vision and project goals.",
      color: "text-cyan-400 border-cyan-400/50 shadow-cyan-400/20",
    },
    {
      icon: Lightbulb,
      title: "Big Ideas",
      description: "Crafting a unique strategy and creative proposal tailored just for you.",
      color: "text-purple-400 border-purple-400/50 shadow-purple-400/20",
    },
    {
      icon: PencilRuler,
      title: "Creative Design",
      description: "Designing beautiful mockups and interactive prototypes to bring your vision to life.",
      color: "text-pink-400 border-pink-400/50 shadow-pink-400/20",
    },
    {
      icon: Code,
      title: "Magic Code",
      description: "Building your project with clean, efficient code using the latest tech.",
      color: "text-green-400 border-green-400/50 shadow-green-400/20",
    },
    {
      icon: Combine,
      title: "Polish & Perfect",
      description: "Testing for a bug-free, seamless experience on all devices.",
      color: "text-orange-400 border-orange-400/50 shadow-orange-400/20",
    },
    {
      icon: Rocket,
      title: "Liftoff!",
      description: "Launching your project for the world to see.",
      color: "text-red-400 border-red-400/50 shadow-red-400/20",
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
    return (
        <AnimatedSection id="process" threshold={0.1}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                    <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                        A streamlined journey from a spark of an idea to a stunning final product.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {processSteps.map((step, index) => {
                        const Icon = step.icon;
                        const stepRef = useRef<HTMLDivElement>(null);
                        const stepInView = useInView(stepRef, { triggerOnce: true, threshold: 0.3 });
                        
                        return (
                            <motion.div
                                key={index}
                                ref={stepRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={stepInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full bg-card/40 dark:bg-white/5 backdrop-blur-3xl border border-border/30 dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl hover:border-border/60 dark:hover:border-white/20 transition-all duration-300">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-xl border bg-background/50 shadow-inner-lg",
                                            step.color
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg font-bold font-headline">
                                            <span className="text-primary/40 mr-2">0{index + 1}</span>
                                            {step.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                  <Button asChild className="btn-glass rounded-full text-base">
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
