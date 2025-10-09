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

const portfolioItems = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with a custom CMS and payment gateway integration.',
    image: 'https://picsum.photos/seed/ecom/600/400',
    hint: 'online store',
    tags: ['Web', 'React', 'Node.js'],
    category: 'web',
  },
  {
    title: 'Mobile Banking App',
    description: 'Secure and intuitive mobile banking application for iOS and Android.',
    image: 'https://picsum.photos/seed/bank/600/400',
    hint: 'mobile banking',
    tags: ['Mobile', 'Flutter', 'Firebase'],
    category: 'mobile',
  },
  {
    title: 'Corporate Branding',
    description: 'Complete brand identity design for a major tech startup, including logo and style guides.',
    image: 'https://picsum.photos/seed/brand/600/400',
    hint: 'brand design',
    tags: ['Design', 'Branding'],
    category: 'design',
  },
  {
    title: 'Project Management Tool',
    description: 'A collaborative project management tool to streamline team workflows.',
    image: 'https://picsum.photos/seed/pm/600/400',
    hint: 'team collaboration',
    tags: ['Web', 'Vue.js', 'GraphQL'],
    category: 'web',
  },
  {
    title: 'Fitness Tracker App',
    description: 'A mobile app to track workouts, nutrition, and progress with social features.',
    image: 'https://picsum.photos/seed/fit/600/400',
    hint: 'fitness app',
    tags: ['Mobile', 'React Native'],
    category: 'mobile',
  },
  {
    title: 'SaaS Dashboard UI Kit',
    description: 'A comprehensive UI kit for designing modern and responsive SaaS dashboards.',
    image: 'https://picsum.photos/seed/saas/600/400',
    hint: 'dashboard interface',
    tags: ['Design', 'UI/UX'],
    category: 'design',
  },
];

const PortfolioCard = ({ item, index, isVisible }: { item: (typeof portfolioItems)[0], index: number, isVisible: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    const rotateX = (y / height) * -20;
    const rotateY = (x / width) * 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("group relative transition-transform duration-300 ease-out", isVisible ? 'animate-fade-in-up' : 'opacity-0')}
      style={{ transformStyle: 'preserve-3d', animationDelay: `${(index % 3) * 150}ms` }}
    >
      <Card className="overflow-hidden transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/10 w-full h-full">
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <CardHeader className="p-0 relative">
          <Image
            src={item.image}
            alt={item.title}
            width={600}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={item.hint}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </CardHeader>
        <CardContent className="p-6 absolute bottom-0 left-0 right-0">
           <div style={{ transform: 'translateZ(50px)' }}>
            <h3 className="text-xl font-bold font-headline text-white drop-shadow-md">{item.title}</h3>
            <p className="mt-2 text-white/80 text-sm drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-white/20 text-white border-none">
                  {tag}
                </Badge>
              ))}
            </div>
           </div>
        </CardContent>
      </Card>
      <div className="absolute -inset-1 border-2 border-primary/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};


const PortfolioGrid = () => {
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: 0.1 });
  const [cardsVisible, setCardsVisible] = useState(false);

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

  const filterButtonStyle =
    'rounded-full backdrop-blur-sm border-white/20 shadow-lg transition-all duration-300';
  const activeFilterButtonStyle = 'bg-primary text-primary-foreground';
  const inactiveFilterButtonStyle =
    'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white';

  return (
    <section id="projects" ref={sectionRef} className="container py-24 sm:py-32">
       <div className={cn(inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center gap-2 mt-8", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
        <Button
          className={cn(filterButtonStyle, filter === 'all' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => handleFilterChange('all')}
        >
          All
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'web' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => handleFilterChange('web')}
        >
          Web
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'mobile' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => handleFilterChange('mobile')}
        >
          Mobile
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'design' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => handleFilterChange('design')}
        >
          Design
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 [perspective:2000px]">
        {filteredItems.map((item, index) => (
          <PortfolioCard key={`${filter}-${item.title}-${index}`} item={item} index={index} isVisible={cardsVisible} />
        ))}
      </div>
    </section>
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
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background to-black/50" />
        </div>
        <div className={cn("container relative z-10 px-4 md:px-6 text-layer transition-opacity duration-1000", isMounted ? 'opacity-100' : 'opacity-0' )}>
          <div className="flex flex-col items-center space-y-6">
            <div className="p-8 rounded-3xl">
              <h1 className={cn("text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>Mohamed Aref</h1>
              <p className={cn("text-xl md:text-2xl font-medium text-white/70 mt-2 transition-all duration-1000 delay-200", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>Creative Developer & Designer</p>
            </div>
            <p className={cn("max-w-[700px] text-muted-foreground md:text-xl transition-all duration-1000 delay-400", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>
              I build beautiful, functional, and user-centric digital experiences. Let's create something
              amazing together.
            </p>
            <div className={cn("flex flex-col gap-4 min-[400px]:flex-row transition-all duration-1000 delay-600", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>
              <Button asChild size="lg" className="bg-background/20 backdrop-blur-lg border border-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg">
                <a href="#contact">Get in Touch</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-background/20 backdrop-blur-lg border border-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg">
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

          <AnimatedSection id="about" className="w-full py-24 sm:py-32 rounded-3xl backdrop-blur-lg border border-white/10 shadow-lg bg-white/5 my-16">
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
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20">
                    <Code className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Web Development</h3>
                  <p className="text-muted-foreground text-center">
                    Building responsive and scalable web applications with modern technologies.
                  </p>
                </div>
                <div className={cn("flex flex-col items-center gap-2 transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{transitionDelay: '400ms'}}>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20">
                    <Film className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Mobile Apps</h3>
                  <p className="text-muted-foreground text-center">
                    Creating cross-platform mobile experiences that engage and delight users.
                  </p>
                </div>
                <div className={cn("flex flex-col items-center gap-2 transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{transitionDelay: '600ms'}}>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20">
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

    