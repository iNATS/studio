'use client';

import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Film, Palette } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, MouseEvent, useEffect } from 'react';
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
};

const portfolioItems: PortfolioItem[] = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with a custom CMS and payment gateway integration. This project involved building a robust backend with Node.js and a dynamic front-end with React, ensuring a seamless user experience from browsing to checkout.',
    image: 'https://picsum.photos/seed/ecom/600/400',
    hint: 'online store',
    tags: ['Web', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'web',
  },
  {
    title: 'Mobile Banking App',
    description: 'A secure and intuitive mobile banking application for iOS and Android, built with Flutter. It features biometric authentication, real-time transaction updates, and a user-friendly interface for managing accounts and payments.',
    image: 'https://picsum.photos/seed/bank/600/400',
    hint: 'mobile banking',
    tags: ['Mobile', 'Flutter', 'Firebase', 'Security'],
    category: 'mobile',
  },
  {
    title: 'Corporate Branding',
    description: 'A complete brand identity design for a major tech startup. This included logo design, a comprehensive style guide, marketing collateral, and UI mockups to ensure a consistent and powerful brand presence across all platforms.',
    image: 'https://picsum.photos/seed/brand/600/400',
    hint: 'brand design',
    tags: ['Design', 'Branding', 'Illustrator', 'Figma'],
    category: 'design',
  },
  {
    title: 'Project Management Tool',
    description: 'A collaborative project management tool designed to streamline team workflows. Built with Vue.js and GraphQL, it offers features like task tracking, team communication, and file sharing to enhance productivity.',
    image: 'https://picsum.photos/seed/pm/600/400',
    hint: 'team collaboration',
    tags: ['Web', 'Vue.js', 'GraphQL', 'Apollo'],
    category: 'web',
  },
  {
    title: 'Fitness Tracker App',
    description: 'A mobile app to track workouts, nutrition, and progress with social features. Using React Native, it provides a cross-platform solution with a focus on user engagement and data visualization.',
    image: 'https://picsum.photos/seed/fit/600/400',
    hint: 'fitness app',
    tags: ['Mobile', 'React Native', 'HealthKit'],
    category: 'mobile',
  },
  {
    title: 'SaaS Dashboard UI Kit',
    description: 'A comprehensive UI kit for designing modern and responsive SaaS dashboards. This kit, created in Figma, includes a wide range of components, templates, and styles to accelerate the design process for data-heavy applications.',
    image: 'https://picsum.photos/seed/saas/600/400',
    hint: 'dashboard interface',
    tags: ['Design', 'UI/UX', 'Figma', 'Component Library'],
    category: 'design',
  },
];

const PortfolioCard = ({ item, index, isVisible, onClick }: { item: PortfolioItem, index: number, isVisible: boolean, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-lg transition-all duration-700 ease-in-out cursor-pointer overflow-hidden",
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${(index % 3) * 150}ms` }}
    >
      <Card className="overflow-hidden transition-all duration-500 bg-card/50 dark:bg-white/5 backdrop-blur-lg border border-border dark:border-white/10 w-full h-full group-hover:bg-card/60 dark:group-hover:bg-white/10 group-hover:border-border dark:group-hover:border-white/20 group-hover:scale-105">
        <CardHeader className="p-0 relative">
          <Image
            src={item.image}
            alt={item.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-500"
            data-ai-hint={item.hint}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold font-headline text-foreground dark:text-white">{item.title}</h3>
          <p className="mt-2 text-muted-foreground dark:text-white/70 text-sm h-10 overflow-hidden text-ellipsis">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-white/10 dark:text-white/80 border-none transition-colors duration-300 group-hover:bg-secondary/80 dark:group-hover:bg-white/20">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-primary/40 dark:group-hover:border-white/40 transition-all duration-500 pointer-events-none" />
    </div>
  );
};


const PortfolioGrid = () => {
  const [filter, setFilter] = useState('all');
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
    setCardsVisible(false);
    setTimeout(() => {
      setFilter(newFilter);
      setCardsVisible(true);
    }, 150); // A short delay for the animations to reset
  };

  const filteredItems = filter === 'all' ? portfolioItems : portfolioItems.filter((item) => item.category === filter);

  return (
    <>
    <section id="projects" ref={sectionRef} className="container py-24 sm:py-32">
       <div className={cn(inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center mt-8", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
        <div className="p-1 rounded-full bg-background/60 backdrop-blur-sm border border-border/40 shadow-lg flex items-center gap-1">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            className="rounded-full"
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button
             variant={filter === 'web' ? 'default' : 'ghost'}
            className="rounded-full"
            onClick={() => handleFilterChange('web')}
          >
            Web
          </Button>
          <Button
             variant={filter === 'mobile' ? 'default' : 'ghost'}
            className="rounded-full"
            onClick={() => handleFilterChange('mobile')}
          >
            Mobile
          </Button>
          <Button
            variant={filter === 'design' ? 'default' : 'ghost'}
            className="rounded-full"
            onClick={() => handleFilterChange('design')}
          >
            Design
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {filteredItems.map((item, index) => (
          <PortfolioCard key={`${filter}-${item.title}-${index}`} item={item} index={index} isVisible={cardsVisible} onClick={() => setSelectedProject(item)} />
        ))}
      </div>
    </section>
    <ProjectDetailModal isOpen={!!selectedProject} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)} project={selectedProject} />
    </>
  );
};

const ContactForm = () => {
  return (
    <form className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input placeholder="Your Name" />
        <Input type="email" placeholder="Your Email" />
      </div>
      <Textarea placeholder="Your Message" rows={5} />
      <Button type="submit" size="lg" className="w-full sm:w-auto justify-self-start bg-accent hover:bg-accent/90">
        Send Message
      </Button>
    </form>
  );
};

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });

  return (
    <section ref={sectionRef} id={id} className={cn(className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
      {children}
    </section>
  )
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section
          className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden"
          style={{paddingTop: 0, marginTop: 0}}
        >
        <div className="absolute inset-0 w-full h-full bg-layer">
          <Image
            src="https://picsum.photos/seed/hero-bg/1920/1080"
            alt="Hero Background"
            fill
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background to-background/20 dark:to-black/50" />
        </div>
        <div className={cn("container relative z-10 px-4 md:px-6 text-layer transition-opacity duration-1000", isMounted ? 'opacity-100' : 'opacity-0' )}>
          <div className="flex flex-col items-center space-y-6">
            <div className="p-8 rounded-3xl">
              <h1 className={cn("text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>Mohamed Aref</h1>
              <p className={cn("text-xl md:text-2xl font-medium text-muted-foreground mt-2 transition-all duration-1000 delay-200", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>Creative Developer & Designer</p>
            </div>
            <p className={cn("max-w-[700px] text-muted-foreground md:text-xl transition-all duration-1000 delay-400", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>
              I build beautiful, functional, and user-centric digital experiences. Let's create something
              amazing together.
            </p>
            <div className={cn("flex flex-col gap-4 min-[400px]:flex-row transition-all duration-1000 delay-600", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
                <a href="#contact">Get in Touch</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="backdrop-blur-lg border border-border text-foreground hover:bg-accent/80 transition-all duration-300 hover:scale-105 shadow-lg">
                <Link href="/vibe-check">
                  Try AI Vibe Check <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

        <div className="p-4 md:p-6 lg:p-12">
          <PortfolioGrid />

          <AnimatedSection id="about" className="w-full py-24 sm:py-32 rounded-3xl backdrop-blur-lg border border-border dark:border-white/10 shadow-lg bg-card/50 dark:bg-white/5 my-16">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">About Me</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I am a passionate developer and designer with a knack for crafting elegant solutions to complex problems.
                  With expertise in front-end frameworks, mobile development, and UI/UX principles, I bring ideas to life
                  from concept to launch. My goal is to create products that are not only visually appealing but also
                  highly usable and performant.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className={cn("flex flex-col items-center gap-2 transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{transitionDelay: '200ms'}}>
                  <div className="bg-secondary dark:bg-white/10 backdrop-blur-sm p-4 rounded-full border border-border dark:border-white/20">
                    <Code className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Web Development</h3>
                  <p className="text-muted-foreground text-center">
                    Building responsive and scalable web applications with modern technologies.
                  </p>
                </div>
                <div className={cn("flex flex-col items-center gap-2 transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{transitionDelay: '400ms'}}>
                  <div className="bg-secondary dark:bg-white/10 backdrop-blur-sm p-4 rounded-full border border-border dark:border-white/20">
                    <Film className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Mobile Apps</h3>
                  <p className="text-muted-foreground text-center">
                    Creating cross-platform mobile experiences that engage and delight users.
                  </p>
                </div>
                <div className={cn("flex flex-col items-center gap-2 transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{transitionDelay: '600ms'}}>
                  <div className="bg-secondary dark:bg-white/10 backdrop-blur-sm p-4 rounded-full border border-border dark:border-white/20">
                    <Palette className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">UI/UX Design</h3>
                  <p className="text-muted-foreground text-center">
                    Designing intuitive and beautiful interfaces that focus on user experience.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection id="contact" className="w-full py-24 sm:py-32" threshold={0.4}>
            <div className="container px-4 sm:px-0">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Contact Me</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
                  Have a project in mind or just want to say hello? Drop me a line.
                </p>
              </div>
              <div className="mx-auto mt-12 max-w-2xl px-4 sm:px-0">
                <ContactForm />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>
      <SocialFab />
      <Footer />
    </div>
  );
}

    

    

    