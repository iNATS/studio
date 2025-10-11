'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full bg-background/10 dark:bg-black/30" />
      <div className={cn('relative z-10 transition-opacity duration-1000', isMounted ? 'opacity-100' : 'opacity-0')}>
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="p-8 rounded-3xl">
            <h1 className={cn('text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline transition-all duration-1000', isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
              Mohamed Aref
            </h1>
            <p className={cn('text-lg md:text-xl font-medium text-muted-foreground mt-2 transition-all duration-1000 delay-200', isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
              Creative Developer & Designer
            </p>
          </div>
          <p className={cn('max-w-[700px] text-muted-foreground text-base sm:text-lg transition-all duration-1000 delay-400', isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
            I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
          </p>
          <div className={cn('flex flex-col gap-4 min-[400px]:flex-row transition-all duration-1000 delay-600', isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-lg border border-border text-foreground hover:bg-accent/80 transition-all duration-300 hover:scale-105 shadow-lg">
              <Link href="/vibe-check">
                Try AI Vibe Check <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
