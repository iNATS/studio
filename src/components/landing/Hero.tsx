'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      className="relative w-full h-[80vh] min-h-[700px] flex items-center justify-center text-center px-4 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, hsl(var(--primary-rgb) / 0.1), transparent 70%)',
          }}
        />
        <div className="aurora-bg">
          <div className="aurora-outer">
            <div className="aurora-inner"></div>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate={isMounted ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center"
      >
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6">
            <Image
              src="https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj"
              alt="Mohamed Aref"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>
          <p className="text-lg md:text-xl font-medium text-muted-foreground">
            Creative Developer & Designer
          </p>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline mt-2 bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary/40 dark:from-white dark:via-white/80 dark:to-white/40">
            Mohamed Aref
          </h1>
        </motion.div>

        <motion.p
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          className="mt-6 max-w-[600px] text-muted-foreground text-base sm:text-lg"
        >
          I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
        </motion.p>
        
        <motion.div
          variants={FADE_UP_VARIANTS}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.6 }}
          className="flex flex-col gap-4 min-[400px]:flex-row pt-8"
        >
          <Button asChild size="lg" className="rounded-full text-base shadow-lg">
              <a href="#contact">Get in Touch</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="btn-glass rounded-full text-base shadow-lg">
              <a href="#projects">
              View My Work <ArrowRight className="ml-2 h-4 w-4" />
              </a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
