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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial="hidden"
        animate={isMounted ? 'visible' : 'hidden'}
        transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
        className="relative z-10 w-full max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div 
              className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto md:mx-0"
              variants={FADE_UP_VARIANTS}
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

            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                <motion.div 
                variants={FADE_UP_VARIANTS} 
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
                >
                <motion.h1 
                    className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline"
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
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.7 }}
                    className="text-lg md:text-xl font-medium text-muted-foreground mt-2"
                >
                    Creative Developer & Designer
                </motion.p>
                </motion.div>
                <motion.p
                variants={FADE_UP_VARIANTS}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 1.0 }}
                className="max-w-[600px] text-muted-foreground text-base sm:text-lg"
                >
                I build beautiful, functional, and user-centric digital experiences. Let's create something amazing together.
                </motion.p>
                <motion.div
                variants={FADE_UP_VARIANTS}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 1.3 }}
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
            </div>
        </div>
      </motion.div>
    </section>
  );
}
