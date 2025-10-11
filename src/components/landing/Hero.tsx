'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-start text-left overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial="hidden"
        animate={isMounted ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
        className="relative z-10 flex flex-col items-start space-y-6 max-w-3xl"
      >
        <motion.div 
          variants={FADE_UP_VARIANTS} 
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline">
            Mohamed Aref
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground mt-3">
            Creative Developer & Designer
          </p>
        </motion.div>
        <motion.p
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-[600px] text-muted-foreground text-base sm:text-lg"
        >
          I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
        </motion.p>
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col gap-4 min-[400px]:flex-row"
        >
          <Button asChild size="lg" className="btn-glass rounded-full text-base hover:scale-105 shadow-lg">
            <a href="#contact">Get in Touch</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-glass rounded-full text-base hover:scale-105 shadow-lg">
            <Link href="/vibe-check">
              Try AI Vibe Check <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
