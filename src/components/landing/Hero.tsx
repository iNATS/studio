'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => (pos === 1 ? 'relative' : 'sticky'));

  const FADE_DOWN_VARIANTS = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const name = "Mohamed Aref";
  const nameVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const letterVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      ref={targetRef}
      id="home"
      className="relative w-full min-h-[150vh] flex items-start justify-center pt-24 sm:pt-32"
      style={{ opacity }}
    >
      <motion.div
        style={{ scale, position }}
        className="top-32 flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial="hidden"
          animate={isMounted ? 'visible' : 'hidden'}
          transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
          className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6"
            variants={FADE_DOWN_VARIANTS}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
              <Image
                  src="https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj"
                  alt="Mohamed Aref"
                  fill
                  className="object-contain rounded-full"
                  priority
              />
          </motion.div>

          <motion.div 
            variants={FADE_DOWN_VARIANTS} 
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.p 
                variants={FADE_DOWN_VARIANTS}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
                className="text-lg md:text-xl font-medium text-muted-foreground"
            >
                Creative Developer & Designer
            </motion.p>
            <motion.h1 
                className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline mt-2"
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
          </motion.div>

          <motion.p
            variants={FADE_DOWN_VARIANTS}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.0 }}
            className="mt-6 max-w-[600px] text-muted-foreground text-base sm:text-lg"
          >
            I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
          </motion.p>
          
          <motion.div
            variants={FADE_DOWN_VARIANTS}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 1.3 }}
            className="flex flex-col gap-4 min-[400px]:flex-row pt-6"
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
      </motion.div>
    </motion.section>
  );
}
