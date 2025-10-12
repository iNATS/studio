'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';

export type PortfolioItem = {
  title: string;
  slug: string;
  description: string;
  image: string;
  hint: string;
  tags: string[];
  category: string;
  link?: string;
  fullDescription: string;
  screenshots: string[];
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution with a custom CMS and payment gateway integration.',
    image: 'https://picsum.photos/seed/ecom/600/400',
    hint: 'online store',
    tags: ['Web', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'web',
    link: '#',
    fullDescription: 'This project involved building a robust backend with Node.js and a dynamic front-end with React, ensuring a seamless user experience from browsing to checkout. The platform includes features like product management, order tracking, and secure payments with Stripe. The custom CMS allows for easy content updates and management of the entire e-commerce store.',
    screenshots: [
        'https://picsum.photos/seed/ecom-s1/1200/800',
        'https://picsum.photos/seed/ecom-s2/1200/800',
        'https://picsum.photos/seed/ecom-s3/1200/800',
        'https://picsum.photos/seed/ecom-s4/1200/800',
      ],
  },
  {
    title: 'Mobile Banking App',
    slug: 'mobile-banking-app',
    description: 'A secure and intuitive mobile banking application for iOS and Android, built with Flutter.',
    image: 'https://picsum.photos/seed/bank/600/400',
    hint: 'mobile banking',
    tags: ['Mobile', 'Flutter', 'Firebase', 'Security'],
    category: 'mobile',
    link: '#',
    fullDescription: 'It features biometric authentication, real-time transaction updates, and a user-friendly interface for managing accounts and payments. Security was a top priority, implementing end-to-end encryption and leveraging Firebase for secure authentication and database management. The app provides a seamless and safe banking experience on the go.',
    screenshots: [
        'https://picsum.photos/seed/bank-s1/1200/800',
        'https://picsum.photos/seed/bank-s2/1200/800',
      ],
  },
  {
    title: 'Corporate Branding',
    slug: 'corporate-branding',
    description: 'A complete brand identity design for a major tech startup.',
    image: 'https://picsum.photos/seed/brand/600/400',
    hint: 'brand design',
    tags: ['Design', 'Branding', 'Illustrator', 'Figma'],
    category: 'design',
    link: '#',
    fullDescription: 'This included logo design, a comprehensive style guide, marketing collateral, and UI mockups to ensure a consistent and powerful brand presence across all platforms. The goal was to create a memorable and impactful brand that resonates with the target audience and stands out in a competitive market.',
    screenshots: [
        'https://picsum.photos/seed/brand-s1/1200/800',
        'https://picsum.photos/seed/brand-s2/1200/800',
        'https://picsum.photos/seed/brand-s3/1200/800',
      ],
  },
  {
    title: 'Project Management Tool',
    slug: 'project-management-tool',
    description: 'A collaborative project management tool designed to streamline team workflows.',
    image: 'https://picsum.photos/seed/pm/600/400',
    hint: 'team collaboration',
    tags: ['Web', 'Vue.js', 'GraphQL', 'Apollo'],
    category: 'web',
    link: '#',
    fullDescription: 'Built with Vue.js and GraphQL, it offers features like task tracking, team communication, and file sharing to enhance productivity. The real-time updates and collaborative features make it an essential tool for any team looking to improve their project management process.',
    screenshots: [
        'https://picsum.photos/seed/pm-s1/1200/800',
        'https://picsum.photos/seed/pm-s2/1200/800',
        'https://picsum.photos/seed/pm-s3/1200/800',
      ],
  },
  {
    title: 'Fitness Tracker App',
    slug: 'fitness-tracker-app',
    description: 'A mobile app to track workouts, nutrition, and progress with social features.',
    image: 'https://picsum.photos/seed/fit/600/400',
    hint: 'fitness app',
    tags: ['Mobile', 'React Native', 'HealthKit'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Using React Native, it provides a cross-platform solution with a focus on user engagement and data visualization. Integration with HealthKit allows for seamless tracking of health data, while social features encourage users to stay motivated and connected with their fitness community.',
    screenshots: [
        'https://picsum.photos/seed/fit-s1/1200/800',
      ],
  },
  {
    title: 'SaaS Dashboard UI Kit',
    slug: 'saas-dashboard-ui-kit',
    description: 'A comprehensive UI kit for designing modern and responsive SaaS dashboards.',
    image: 'https://picsum.photos/seed/saas/600/400',
    hint: 'dashboard interface',
    tags: ['Design', 'UI/UX', 'Figma', 'Component Library'],
    category: 'design',
    link: '#',
    fullDescription: 'This kit, created in Figma, includes a wide range of components, templates, and styles to accelerate the design process for data-heavy applications. It is designed to be fully customizable and scalable, allowing designers to create beautiful and functional dashboards with ease.',
    screenshots: [
        'https://picsum.photos/seed/saas-s1/1200/800',
        'https://picsum.photos/seed/saas-s2/1200/800',
        'https://picsum.photos/seed/saas-s3/1200/800',
        'https://picsum.photos/seed/saas-s4/1200/800',
      ],
  },
];

const PortfolioCard = ({ item, index, isVisible, onClick }: { item: PortfolioItem, index: number, isVisible: boolean, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-3xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden",
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${(index % 3) * 150}ms` }}
    >
      <div className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border border-border/40 dark:border-white/20 shadow-2xl overflow-hidden rounded-3xl transition-all duration-300 group-hover:shadow-primary/20 group-hover:border-border/80 dark:group-hover:border-white/30 h-full">
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative h-48 md:h-full w-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              data-ai-hint={item.hint}
            />
          </div>
          <div className="p-6 flex flex-col">
            <h3 className="text-xl font-bold font-headline text-foreground">{item.title}</h3>
            <p className="mt-2 text-foreground/70 dark:text-white/70 text-sm flex-grow">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag, i) => (
                <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-xs font-medium pointer-events-none">
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(4);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: 0.05 });
  const [cardsVisible, setCardsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    if (inView) {
      setCardsVisible(true);
    } else {
      setCardsVisible(false);
    }
  }, [inView]);

  const handleFilterChange = (newFilter: string) => {
    if (filter === newFilter) return;
    setVisibleCount(4); // Reset visible count on filter change
    setCardsVisible(false);
    setTimeout(() => {
      setFilter(newFilter);
      setCardsVisible(true);
    }, 150); // A short delay for the animations to reset
  };

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  const filteredItems = filter === 'all' ? portfolioItems : portfolioItems.filter((item) => item.category === filter);
  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <>
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32 scroll-mt-20">
       <div className={cn("px-4", inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center flex-wrap mt-8 gap-2 px-4", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
          <Button
            variant="ghost"
            onClick={() => handleFilterChange('all')}
            className={cn("btn-glass rounded-full text-base", filter === 'all' ? "btn-glass-active" : "")}
          >
            All
          </Button>
          <Button
             variant="ghost"
             onClick={() => handleFilterChange('web')}
             className={cn("btn-glass rounded-full text-base", filter === 'web' ? "btn-glass-active" : "")}
          >
            Web
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleFilterChange('mobile')}
            className={cn("btn-glass rounded-full text-base", filter === 'mobile' ? "btn-glass-active" : "")}
          >
            Mobile
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleFilterChange('design')}
            className={cn("btn-glass rounded-full text-base", filter === 'design' ? "btn-glass-active" : "")}
          >
            Design
          </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        {visibleItems.map((item, index) => (
          <PortfolioCard key={`${filter}-${item.title}-${index}`} item={item} index={index} isVisible={cardsVisible} onClick={() => setSelectedProject(item)} />
        ))}
      </div>
       {visibleCount < filteredItems.length && (
        <div className="mt-12 text-center px-4">
          <Button onClick={handleLoadMore} size="lg" className="rounded-full text-base shadow-lg">
            Load More
          </Button>
        </div>
      )}
    </section>
    <ProjectDetailModal isOpen={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)} project={selectedProject} />
    </>
  );
};
