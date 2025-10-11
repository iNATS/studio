'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });
  
    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function About() {
  return (
    <AnimatedSection id="about" threshold={0.4} className="px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div className="flex flex-col items-center text-center md:col-span-1">
            <Avatar className="w-40 h-40 sm:w-48 sm:h-48 border-4 border-border/80 dark:border-white/20 shadow-2xl mb-4">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Mohamed Aref" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter font-headline mt-4">Mohamed Aref</h2>
            <p className="text-foreground/70 dark:text-white/70 mt-2 text-xl">Creative Developer & Designer</p>
          </div>
          <div className="md:col-span-2 space-y-10 mt-4 md:mt-0">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-2xl font-bold tracking-tighter font-headline">About Me</h3>
              <p className="text-foreground/80 dark:text-white/80 text-base sm:text-lg leading-relaxed">
                I'm a passionate developer and designer with a knack for crafting elegant solutions to complex problems. I thrive on bringing ideas to life, from the initial concept all the way to a polished, performant product. My goal is to create digital experiences that are not only functional but also beautiful and intuitive.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tighter font-headline mb-4 text-center md:text-left">My Skills</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                {[
                    'React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS',
                    'Node.js', 'GraphQL', 'PostgreSQL', 'Firebase',
                    'React Native', 'Flutter', 'Swift',
                    'Figma', 'Illustrator', 'UI/UX',
                    'Genkit', 'TensorFlow', 'Python',
                    'Git', 'CI/CD', 'Agile'
                ].map(skill => (
                    <Button key={skill} variant="ghost" size="sm" className="bg-card/60 dark:bg-white/10 text-foreground dark:text-white/80 hover:bg-card dark:hover:bg-white/20 hover:text-foreground dark:hover:text-white border border-border/50 dark:border-white/10 text-sm font-medium rounded-full pointer-events-none backdrop-blur-sm">
                        {skill}
                    </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
