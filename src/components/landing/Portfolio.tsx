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
  description: string;
  image: string;
  hint: string;
  tags: string[];
  category: string;
  link?: string;
};

const portfolioItems: PortfolioItem[] = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with a custom CMS and payment gateway integration. This project involved building a robust backend with Node.js and a dynamic front-end with React, ensuring a seamless user experience from browsing to checkout.',
    image: 'https://picsum.photos/seed/ecom/600/400',
    hint: 'online store',
    tags: ['Web', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'web',
    link: '#',
  },
  {
    title: 'Mobile Banking App',
    description: 'A secure and intuitive mobile banking application for iOS and Android, built with Flutter. It features biometric authentication, real-time transaction updates, and a user-friendly interface for managing accounts and payments.',
    image: 'https://picsum.photos/seed/bank/600/400',
    hint: 'mobile banking',
    tags: ['Mobile', 'Flutter', 'Firebase', 'Security'],
    category: 'mobile',
    link: '#',
  },
  {
    title: 'Corporate Branding',
    description: 'A complete brand identity design for a major tech startup. This included logo design, a comprehensive style guide, marketing collateral, and UI mockups to ensure a consistent and powerful brand presence across all platforms.',
    image: 'https://picsum.photos/seed/brand/600/400',
    hint: 'brand design',
    tags: ['Design', 'Branding', 'Illustrator', 'Figma'],
    category: 'design',
    link: '#',
  },
  {
    title: 'Project Management Tool',
    description: 'A collaborative project management tool designed to streamline team workflows. Built with Vue.js and GraphQL, it offers features like task tracking, team communication, and file sharing to enhance productivity.',
    image: 'https://picsum.photos/seed/pm/600/400',
    hint: 'team collaboration',
    tags: ['Web', 'Vue.js', 'GraphQL', 'Apollo'],
    category: 'web',
    link: '#',
  },
  {
    title: 'Fitness Tracker App',
    description: 'A mobile app to track workouts, nutrition, and progress with social features. Using React Native, it provides a cross-platform solution with a focus on user engagement and data visualization.',
    image: 'https://picsum.photos/seed/fit/600/400',
    hint: 'fitness app',
    tags: ['Mobile', 'React Native', 'HealthKit'],
    category: 'mobile',
    link: '#',
  },
  {
    title: 'SaaS Dashboard UI Kit',
    description: 'A comprehensive UI kit for designing modern and responsive SaaS dashboards. This kit, created in Figma, includes a wide range of components, templates, and styles to accelerate the design process for data-heavy applications.',
    image: 'https://picsum.photos/seed/saas/600/400',
    hint: 'dashboard interface',
    tags: ['Design', 'UI/UX', 'Figma', 'Component Library'],
    category: 'design',
    link: '#',
  },
];

const PortfolioCard = ({ item, index, isVisible, onClick }: { item: PortfolioItem, index: number, isVisible: boolean, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden",
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${(index % 3) * 150}ms` }}
    >
      <Card className="overflow-hidden transition-all duration-500 bg-card/60 dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 w-full h-full group-hover:bg-card/80 dark:group-hover:bg-white/10 group-hover:border-border/80 dark:group-hover:border-white/20 flex flex-col">
        <CardHeader className="p-0 relative overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={item.hint}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold font-headline text-foreground dark:text-white">{item.title}</h3>
          <p className="mt-2 text-foreground/70 dark:text-white/70 text-sm h-10 overflow-hidden text-ellipsis flex-grow">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <Button key={i} variant="ghost" size="sm" className="bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border-none text-sm font-medium rounded-full pointer-events-none">
                {tag}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-black/20 dark:group-hover:border-white/40 transition-all duration-500 pointer-events-none" />
    </div>
  );
};


export function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: 0.1 });
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
    setVisibleCount(6); // Reset visible count on filter change
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
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32">
       <div className={cn("px-4", inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center flex-wrap mt-8 gap-2 px-4", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('all')}
            data-active={filter === 'all'}
            className="rounded-full text-base transition-all duration-300 bg-card/60 backdrop-blur-xl border-border hover:bg-accent hover:text-accent-foreground text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground dark:bg-white/5 dark:text-white/80 dark:border-white/10 dark:hover:bg-white/20"
          >
            All
          </Button>
          <Button
             variant={filter === 'web' ? 'default' : 'outline'}
             data-active={filter === 'web'}
            onClick={() => handleFilterChange('web')}
            className="rounded-full text-base transition-all duration-300 bg-card/60 backdrop-blur-xl border-border hover:bg-accent hover:text-accent-foreground text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground dark:bg-white/5 dark:text-white/80 dark:border-white/10 dark:hover:bg-white/20"
          >
            Web
          </Button>
          <Button
             variant={filter === 'mobile' ? 'default' : 'outline'}
             data-active={filter === 'mobile'}
            onClick={() => handleFilterChange('mobile')}
            className="rounded-full text-base transition-all duration-300 bg-card/60 backdrop-blur-xl border-border hover:bg-accent hover:text-accent-foreground text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground dark:bg-white/5 dark:text-white/80 dark:border-white/10 dark:hover:bg-white/20"
          >
            Mobile
          </Button>
          <Button
            variant={filter === 'design' ? 'default' : 'outline'}
            data-active={filter === 'design'}
            onClick={() => handleFilterChange('design')}
            className="rounded-full text-base transition-all duration-300 bg-card/60 backdrop-blur-xl border-border hover:bg-accent hover:text-accent-foreground text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground dark:bg-white/5 dark:text-white/80 dark:border-white/10 dark:hover:bg-white/20"
          >
            Design
          </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 sm:px-6 md:px-8">
        {visibleItems.map((item, index) => (
          <PortfolioCard key={`${filter}-${item.title}-${index}`} item={item} index={index} isVisible={cardsVisible} onClick={() => setSelectedProject(item)} />
        ))}
      </div>
       {visibleCount < filteredItems.length && (
        <div className="mt-12 text-center px-4">
          <Button onClick={handleLoadMore} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
            Load More
          </Button>
        </div>
      )}
    </section>
    <ProjectDetailModal isOpen={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)} project={selectedProject} />
    </>
  );
};
