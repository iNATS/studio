'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { cn } from '@/lib/utils';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { About } from '@/components/landing/About';
import { Process } from '@/components/landing/Process';
import { Testimonials } from '@/components/landing/Testimonials';
import { Contact } from '@/components/landing/Contact';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn('flex min-h-screen flex-col bg-background', !isMounted && 'opacity-0')}>
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <Portfolio />
        <About />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <SocialFab />
      <Footer />
    </div>
  );
}
