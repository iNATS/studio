
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
    title: 'Gamo - E-commerce Platform',
    slug: 'gamo-ecommerce',
    description: 'A modern and sleek e-commerce platform for gaming products, built with Webflow.',
    image: 'https://picsum.photos/seed/gamo-store/600/400',
    hint: 'gaming store',
    tags: ['Webflow', 'UI/UX Design', 'E-commerce'],
    category: 'web',
    link: 'https://gamo-template.webflow.io/',
    fullDescription: 'Gamo is a Webflow template designed for gaming and e-commerce stores. It features a clean and modern design with a focus on user experience, providing a seamless shopping journey for customers looking for gaming gear and accessories.',
    screenshots: [
      'https://picsum.photos/seed/gamo-s1/1200/800',
      'https://picsum.photos/seed/gamo-s2/1200/800',
    ],
  },
  {
    title: 'Aqar - Real Estate App',
    slug: 'aqar-real-estate',
    description: 'A mobile application concept for a real estate platform to find and explore properties.',
    image: 'https://picsum.photos/seed/aqar-app/400/600',
    hint: 'property app',
    tags: ['Mobile Design', 'UI/UX Design', 'Figma', 'Prototyping'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Aqar is a UI/UX concept for a real estate mobile app. The design focuses on providing a simple, intuitive, and map-centric experience for users to search for properties, view details, and connect with agents. The prototype was created in Figma.',
    screenshots: [
      'https://picsum.photos/seed/aqar-s1/800/1200',
      'https://picsum.photos/seed/aqar-s2/800/1200',
    ],
  },
  {
    title: 'Mentor - Online Courses App',
    slug: 'mentor-courses-app',
    description: 'A mobile app UI for an online learning platform, connecting students with mentors.',
    image: 'https://picsum.photos/seed/mentor-app/400/600',
    hint: 'learning app',
    tags: ['Mobile Design', 'UI/UX Design', 'Figma'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Mentor is a UI concept for a mobile app that facilitates online learning. The design aims to create an engaging and user-friendly environment for students to browse courses, interact with content, and connect with mentors for guidance.',
    screenshots: [
        'https://picsum.photos/seed/mentor-s1/800/1200',
        'https://picsum.photos/seed/mentor-s2/800/1200',
    ],
  },
   {
    title: 'Matador - Food Delivery App',
    slug: 'matador-food-delivery',
    description: 'UI/UX design for a food delivery mobile application with a focus on a simple and delightful ordering experience.',
    image: 'https://picsum.photos/seed/matador-app/400/600',
    hint: 'food delivery',
    tags: ['UI/UX Design', 'Mobile Design', 'Figma'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Matador is a UI/UX concept for a food delivery app. The design prioritizes a visually appealing menu, easy navigation, and a streamlined checkout process to make ordering food a quick and enjoyable experience for the user.',
    screenshots: [
      'https://picsum.photos/seed/matador-s1/800/1200',
      'https://picsum.photos/seed/matador-s2/800/1200',
    ],
  },
  {
    title: "Let's Git - Developer Platform",
    slug: 'lets-git-platform',
    description: 'A Webflow template for developers to showcase their projects and skills.',
    image: 'https://picsum.photos/seed/lets-git/600/400',
    hint: 'developer portfolio',
    tags: ['Webflow', 'Web Design', 'UI/UX'],
    category: 'web',
    link: 'https://lets-git.webflow.io/',
    fullDescription: "Let's Git is a sleek, dark-mode Webflow template designed for developers. It serves as a portfolio and personal site, allowing developers to present their projects, share their skills, and write blog posts in a modern and professional layout.",
    screenshots: [
        'https://picsum.photos/seed/lets-git-s1/1200/800',
        'https://picsum.photos/seed/lets-git-s2/1200/800',
    ],
  },
  {
    title: 'Brand & Logo Design',
    slug: 'brand-logo-design',
    description: 'A collection of logos and brand identities created for various clients.',
    image: 'https://picsum.photos/seed/logo-collection/600/400',
    hint: 'logo designs',
    tags: ['Branding', 'Logo Design', 'Visual Identity', 'Illustrator'],
    category: 'design',
    link: '#',
    fullDescription: 'This project is a showcase of various brand identity and logo design work for a diverse range of clients. Each logo is crafted to be unique, memorable, and reflective of the brand\'s core values and mission. The process involves extensive research, conceptualization, and refinement to deliver a powerful visual identity.',
    screenshots: [
      'https://picsum.photos/seed/logo-s1/1200/800',
      'https://picsum.photos/seed/logo-s2/1200/800',
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
  const [visibleCount, setVisibleCount] = useState(6);
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
    setVisibleCount(6); // Reset visible count on filter change
    setCardsVisible(false);
    setTimeout(() => {
      setFilter(newFilter);
      setCardsVisible(true);
    }, 150); // A short delay for the animations to reset
  };

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
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
          <PortfolioCard key={`${filter}-${item.slug}-${index}`} item={item} index={index} isVisible={cardsVisible} onClick={() => setSelectedProject(item)} />
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
