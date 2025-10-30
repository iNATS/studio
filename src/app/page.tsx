'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { About } from '@/components/landing/About';
import { Process } from '@/components/landing/Process';
import { Testimonials } from '@/components/landing/Testimonials';
import { Contact } from '@/components/landing/Contact';
import { motion } from 'framer-motion';
import { getPortfolioItems, getPageContent, getTestimonials } from '@/lib/db';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { useEffect, useState } from 'react';

export default function Home() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [processContent, setProcessContent] = useState(null);
  const [testimonials, setTestimonials] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [
        items,
        hero,
        about,
        process,
        testimonialsData,
      ] = await Promise.all([
        getPortfolioItems(),
        getPageContent('hero'),
        getPageContent('about'),
        getPageContent('process'),
        getTestimonials(),
      ]);
      setPortfolioItems(items);
      setHeroContent(hero);
      setAboutContent(about);
      setProcessContent(process);
      setTestimonials(testimonialsData);
    }
    fetchData();
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className='flex min-h-screen flex-col bg-background'
    >
      <Header />
      <main className="flex-1 w-full">
        <Hero content={heroContent} />
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Portfolio initialItems={portfolioItems} />
          <About content={aboutContent} />
          <Process content={processContent} />
          <Testimonials initialTestimonials={testimonials} />
          <Contact />
        </motion.div>
      </main>
      <SocialFab />
      <Footer />
    </motion.div>
  );
}
