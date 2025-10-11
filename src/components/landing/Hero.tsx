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

  const FADE_IN_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden px-4"
    >
      <motion.div
        initial="hidden"
        animate={isMounted ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.2 }}
        className="relative z-10 flex flex-col items-center space-y-6"
      >
        <motion.div variants={FADE_IN_VARIANTS}>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Mohamed Aref
          </h1>
          <p className="text-lg md:text-xl font-medium text-muted-foreground mt-2">
            Creative Developer & Designer
          </p>
        </motion.div>
        <motion.p
          variants={FADE_IN_VARIANTS}
          className="max-w-[600px] text-muted-foreground text-base sm:text-lg"
        >
          I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
        </motion.p>
        <motion.div
          variants={FADE_IN_VARIANTS}
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
