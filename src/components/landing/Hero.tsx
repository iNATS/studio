'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const FADE_UP_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const name = "Mohamed Aref";
  const nameVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };
  
  const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial="hidden"
        animate={isMounted ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
        className="relative z-10 flex flex-col items-center space-y-6 max-w-4xl"
      >
        <motion.div 
          variants={FADE_UP_VARIANTS} 
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl font-headline"
            variants={nameVariants}
          >
            {name.split("").map((char, index) => (
              <motion.span 
                key={`${char}-${index}`} 
                variants={letterVariant} 
                className={cn(
                  "inline-block",
                  char !== " " && "bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary/40 dark:from-white dark:via-white/80 dark:to-white/40"
                )}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p 
            variants={FADE_UP_VARIANTS}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
            className="text-xl md:text-2xl font-medium text-muted-foreground mt-4"
          >
            Creative Developer & Designer
          </motion.p>
        </motion.div>
        <motion.p
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.8 }}
          className="max-w-[600px] text-muted-foreground text-base sm:text-lg"
        >
          I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
        </motion.p>
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 1.1 }}
          className="flex flex-col gap-4 min-[400px]:flex-row pt-4"
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
