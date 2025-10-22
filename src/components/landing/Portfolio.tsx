
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
    title: 'Artisan E-commerce Marketplace',
    slug: 'artisan-ecommerce',
    description: 'A multi-vendor marketplace for handmade goods, featuring custom vendor dashboards and Stripe Connect integration.',
    image: 'https://picsum.photos/seed/artisan-web/600/400',
    hint: 'ecommerce website',
    tags: ['Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'web',
    link: '#',
    fullDescription: 'Developed a full-stack e-commerce platform using Next.js for a dynamic frontend and a Node.js backend with a PostgreSQL database. The project included integrating Stripe Connect to handle complex payment flows for a multi-vendor marketplace. I designed and built custom dashboards for vendors to manage their products, view sales analytics, and handle orders, providing a complete solution for small businesses to sell their handmade goods.',
    screenshots: [
      'https://picsum.photos/seed/artisan-s1/1200/800',
      'https://picsum.photos/seed/artisan-s2/1200/800',
      'https://picsum.photos/seed/artisan-s3/1200/800',
    ],
  },
  {
    title: 'Fintech Mobile App UI/UX',
    slug: 'fintech-mobile-app',
    description: 'A secure and intuitive mobile banking application for iOS and Android, focusing on a clean user experience.',
    image: 'https://picsum.photos/seed/fintech-mobile/600/400',
    hint: 'mobile finance',
    tags: ['Flutter', 'UI/UX Design', 'Firebase', 'Figma', 'Prototyping'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Designed and developed a cross-platform mobile banking app with Flutter, ensuring a native feel on both iOS and Android. The app features biometric authentication, real-time transaction updates, and P2P payments. I conducted extensive user research to create a user-friendly interface, prototyped the entire app in Figma, and used Firebase for secure authentication and real-time database capabilities, resulting in a highly-rated, secure financial tool.',
    screenshots: [
        'https://picsum.photos/seed/fintech-s1/800/1200',
        'https://picsum.photos/seed/fintech-s2/800/1200',
        'https://picsum.photos/seed/fintech-s3/800/1200',
    ],
  },
  {
    title: 'SaaS Analytics Dashboard',
    slug: 'saas-analytics-dashboard',
    description: 'A responsive web application for data visualization and business intelligence, built with React and D3.js.',
    image: 'https://picsum.photos/seed/saas-dashboard/600/400',
    hint: 'data dashboard',
    tags: ['React', 'Web Development', 'D3.js', 'Restful API', 'UI/UX'],
    category: 'web',
    link: '#',
    fullDescription: 'This project involved creating a powerful and responsive analytics dashboard for a SaaS company. I used React and Tailwind CSS to build a modular component library and integrated D3.js for complex, interactive data visualizations. The dashboard securely fetches data from a RESTful API and presents it in an intuitive and actionable way, enabling users to gain insights into their business metrics.',
    screenshots: [
        'https://picsum.photos/seed/saas-s1/1200/800',
        'https://picsum.photos/seed/saas-s2/1200/800',
    ],
  },
  {
    title: 'AI-Powered Copywriting Tool',
    slug: 'ai-copywriting-tool',
    description: 'A web-based tool that leverages generative AI to help marketing teams create content for their campaigns.',
    image: 'https://picsum.photos/seed/ai-writer/600/400',
    hint: 'AI application',
    tags: ['AI Vibe coding', 'Next.js', 'Webflow', 'GenAI'],
    category: 'web',
    link: '#',
    fullDescription: 'This innovative tool integrates a generative AI model through a custom API to generate marketing copy, blog post ideas, and social media content. The frontend was built with Next.js and styled with Tailwind CSS, offering a clean and intuitive interface for users to interact with the AI. I also developed a public-facing marketing site using Webflow to promote the tool.',
    screenshots: [
        'https://picsum.photos/seed/ai-writer-s1/1200/800',
        'https://picsum.photos/seed/ai-writer-s2/1200/800',
    ],
  },
  {
    title: 'Real Estate Listing Platform',
    slug: 'real-estate-platform',
    description: 'A comprehensive real estate platform with advanced search, interactive maps, and agent profiles.',
    image: 'https://picsum.photos/seed/real-estate/600/400',
    hint: 'property listings',
    tags: ['Web Development', 'Google Maps API', 'React', 'Node.js'],
    category: 'web',
    link: '#',
    fullDescription: 'I built a full-featured real estate platform with a React frontend and a Node.js backend. A key feature is the deep integration of the Google Maps API to provide interactive map-based search, property location visualization, and neighborhood insights. The platform also includes features for agents to manage their listings and for users to save their favorite properties.',
    screenshots: [
        'https://picsum.photos/seed/real-estate-s1/1200/800',
        'https://picsum.photos/seed/real-estate-s2/1200/800',
    ],
  },
  {
    title: 'Food Delivery App',
    slug: 'food-delivery-app',
    description: 'A cross-platform mobile app for a local restaurant chain, enabling online ordering and delivery tracking.',
    image: 'https://picsum.photos/seed/food-app/600/400',
    hint: 'delivery app',
    tags: ['Mobile', 'React Native', 'Firebase', 'UI/UX Design'],
    category: 'mobile',
    link: '#',
    fullDescription: 'This React Native app provides a seamless ordering experience for customers of a local restaurant chain. It includes features like menu browsing, order customization, secure online payments, and real-time delivery tracking on a map. I used Firebase for the backend, including Authentication, Firestore for real-time order updates, and Cloud Functions for payment processing.',
    screenshots: [
      'https://picsum.photos/seed/food-app-s1/800/1200',
      'https://picsum.photos/seed/food-app-s2/800/1200',
    ],
  },
  {
    title: 'Tech Startup Rebrand',
    slug: 'tech-startup-rebrand',
    description: 'A complete visual identity and branding overhaul for a growing technology startup.',
    image: 'https://picsum.photos/seed/startup-rebrand/600/400',
    hint: 'corporate branding',
    tags: ['Design', 'Visual Identity', 'Logo Design', 'Figma', 'Illustrator'],
    category: 'design',
    link: '#',
    fullDescription: 'I led the complete rebranding of a tech startup, which included creating a new logo, defining a color palette and typography system, and designing a full suite of marketing materials. The process involved extensive research and collaboration with the client to create a modern and memorable brand identity that reflects their innovative spirit. All assets were designed in Figma and Illustrator.',
    screenshots: [
        'https://picsum.photos/seed/rebrand-s1/1200/800',
        'https://picsum.photos/seed/rebrand-s2/1200/800',
    ],
  },
  {
    title: 'Healthcare Telemedicine App',
    slug: 'telemedicine-app',
    description: 'A secure mobile app connecting patients with doctors for virtual consultations.',
    image: 'https://picsum.photos/seed/telemedicine-app/600/400',
    hint: 'doctor patient',
    tags: ['Mobile', 'Flutter', 'WebRTC', 'Firebase', 'Security'],
    category: 'mobile',
    link: '#',
    fullDescription: 'Developed a HIPAA-compliant telemedicine app using Flutter for the frontend and Firebase for secure data storage and authentication. The app facilitates video consultations between patients and doctors through a WebRTC integration. Security and privacy were paramount, so I implemented end-to-end encryption for all communications and adhered to strict data handling protocols.',
    screenshots: [
      'https://picsum.photos/seed/telemedicine-s1/800/1200',
      'https://picsum.photos/seed/telemedicine-s2/800/1200',
    ],
  },
  {
    title: 'Boutique Hotel Website',
    slug: 'hotel-website',
    description: 'An elegant and responsive website for a boutique hotel, featuring a custom booking engine.',
    image: 'https://picsum.photos/seed/hotel-web/600/400',
    hint: 'luxury hotel',
    tags: ['Web Design', 'Wordpress', 'PHP', 'JavaScript', 'CSS'],
    category: 'web',
    link: '#',
    fullDescription: 'Designed and developed a custom WordPress theme for a luxury boutique hotel. The website showcases the hotel\'s unique character through beautiful design and immersive visuals. I built a custom booking engine with PHP and JavaScript that integrates with their existing reservation system, allowing guests to book their stay directly on the site. The entire site is fully responsive and optimized for performance.',
    screenshots: [
        'https://picsum.photos/seed/hotel-s1/1200/800',
        'https://picsum.photos/seed/hotel-s2/1200/800',
    ],
  },
  {
    title: 'Packaging Design for a Coffee Brand',
    slug: 'coffee-packaging',
    description: 'Vibrant and eco-friendly packaging design for a new artisanal coffee brand.',
    image: 'https://picsum.photos/seed/coffee-design/600/400',
    hint: 'coffee package',
    tags: ['Design', 'Branding', 'Illustrator', 'Photoshop', 'Packaging'],
    category: 'design',
    link: '#',
    fullDescription: 'Created a full range of packaging for a new artisanal coffee brand, including bags, boxes, and labels. The design concept was centered around sustainability and the brand\'s unique story. I used Adobe Illustrator and Photoshop to create custom illustrations and typography that resulted in a visually striking and cohesive product line that stands out on the shelf.',
    screenshots: [
      'https://picsum.photos/seed/coffee-s1/1200/800',
      'https://picsum.photos/seed/coffee-s2/1200/800',
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
