'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
      <div className="grid gap-8 md:grid-cols-3 items-center max-w-4xl mx-auto">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-border/80 dark:border-white/20 shadow-lg mb-4">
            <AvatarImage src="https://picsum.photos/seed/avatar/200/200" alt="Mohamed Aref" />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter font-headline">Mohamed Aref</h2>
          <p className="text-foreground/70 dark:text-white/70 mt-1 text-lg">Creative Developer & Designer</p>
        </div>
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter font-headline">About Me</h3>
            <p className="text-foreground/80 dark:text-white/80 text-base sm:text-lg leading-relaxed">
              I'm a passionate developer and designer with a knack for crafting elegant solutions to complex problems. I thrive on bringing ideas to life, from the initial concept all the way to a polished, performant product. My goal is to create digital experiences that are not only functional but also beautiful and intuitive.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tighter font-headline mb-4">My Skills</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                'React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS',
                'Node.js', 'GraphQL', 'PostgreSQL', 'Firebase',
                'React Native', 'Flutter', 'Swift',
                'Figma', 'Illustrator', 'UI/UX',
                'Genkit', 'TensorFlow', 'Python',
                'Git', 'CI/CD', 'Agile'
              ].map(skill => (
                <Badge key={skill} variant="secondary" className="bg-card/60 dark:bg-white/5 backdrop-blur-xl border border-border/50 dark:border-white/10 text-foreground/80 dark:text-white/80 text-sm py-1 px-3 sm:py-1.5 sm:px-4">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
