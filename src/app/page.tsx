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

export default async function Home() {
  const portfolioItems: PortfolioItem[] = await getPortfolioItems();
  const heroContent = await getPageContent('hero');
  const aboutContent = await getPageContent('about');
  const processContent = await getPageContent('process');
  const testimonials = await getTestimonials();

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
