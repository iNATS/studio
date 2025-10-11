'use client';

import { useState, useEffect } from 'react';
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
      <div className="absolute inset-0 -z-50">
        <div className="absolute inset-0 -z-40 bg-background"></div>
        <div className="absolute inset-0 -z-30 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-x-0 top-0 h-1/2 -z-20 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="blob-c animation-delay-200"></div>
        <div className="blob-c animation-delay-400"></div>
      </div>
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
            <Button asChild size="lg" className="bg-white/10 text-white/90 hover:bg-white/20 rounded-full text-base backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-lg">
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 text-white/90 hover:bg-white/20 rounded-full text-base backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-lg">
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
