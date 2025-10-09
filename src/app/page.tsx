'use client';

import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialFab } from '@/components/SocialFab';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle, PencilRuler, Code, TestTube2, Rocket, Wrench, Search, Lightbulb, Combine, Palmtree } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

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
        "group relative rounded-2xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden",
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      )}
      style={{ animationDelay: `${(index % 3) * 150}ms` }}
    >
      <Card className="overflow-hidden transition-all duration-500 bg-card/60 dark:bg-white/5 backdrop-blur-xl border border-border dark:border-white/10 w-full h-full group-hover:bg-card/80 dark:group-hover:bg-white/10 group-hover:border-border/80 dark:group-hover:border-white/20">
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
        <CardContent className="p-4">
          <h3 className="text-lg font-bold font-headline text-foreground dark:text-white">{item.title}</h3>
          <p className="mt-2 text-foreground/70 dark:text-white/70 text-sm h-10 overflow-hidden text-ellipsis">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-foreground/10 text-foreground/80 dark:bg-white/10 dark:text-white/80 border-none transition-colors duration-300 group-hover:bg-foreground/20 dark:group-hover:bg-white/20">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-black/20 dark:group-hover:border-white/40 transition-all duration-500 pointer-events-none" />
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
    <section id="projects" ref={sectionRef} className="py-24 sm:py-32">
       <div className={cn(inView ? 'animate-fade-in-up' : 'opacity-0')}>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
          A selection of projects that I'm proud of.
        </p>
      </div>
      <div className={cn("flex justify-center flex-wrap mt-8 gap-2", inView ? 'animate-fade-in-up' : 'opacity-0')} style={{ animationDelay: '200ms' }}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 px-4 md:px-6">
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
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Contact Me</h2>
        <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-xl mx-auto">
          Have a project in mind or just want to say hello? Drop me a line.
        </p>
      </div>
      <form className="grid gap-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80 dark:text-white/80">Your Name</Label>
            <Input id="name" placeholder="John Doe" className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 dark:text-white/80">Your Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="text-foreground/80 dark:text-white/80">Your Message</Label>
          <Textarea id="message" placeholder="I'd like to discuss..." rows={5} className="bg-foreground/5 border-border/50 dark:bg-white/5 dark:border-white/10" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
            Send Message
          </Button>
        </div>
      </form>
    </>
  );
};

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });

  return (
    <section ref={sectionRef} id={id} className={cn("container py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
      {children}
    </section>
  )
}

const processSteps = [
  {
    icon: <MessageCircle className="w-10 h-10 text-primary" />,
    title: "1. Let's Talk",
    description: "We'll start with a friendly chat to understand your vision and project goals.",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    title: "2. Big Ideas",
    description: "I'll craft a unique strategy and creative proposal tailored just for you.",
  },
  {
    icon: <PencilRuler className="w-10 h-10 text-primary" />,
    title: "3. Creative Design",
    description: "I'll design beautiful mockups and interactive prototypes to bring your vision to life.",
  },
  {
    icon: <Code className="w-10 h-10 text-primary" />,
    title: "4. Magic Code",
    description: "I'll build your project with clean, efficient code using the latest tech.",
  },
  {
    icon: <Combine className="w-10 h-10 text-primary" />,
    title: "5. Polish & Perfect",
    description: "We'll test everything to ensure a bug-free, seamless experience on all devices.",
  },
  {
    icon: <Rocket className="w-10 h-10 text-primary" />,
    title: "6. Liftoff!",
    description: "After your final approval, we'll launch your project for the world to see.",
  },
];

const ProcessSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: 0.1 });

    return (
        <section ref={sectionRef} id="process" className="container py-24 sm:py-32">
            <div className={cn("text-center mb-16", inView ? 'animate-fade-in-up' : 'opacity-0')}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">My Creative Process</h2>
                <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
                    A streamlined journey from a spark of an idea to a stunning final product.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {processSteps.map((step, index) => (
                    <div
                        key={step.title}
                        className={cn(
                            "group flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300",
                            "bg-card/50 dark:bg-white/5 backdrop-blur-xl border border-card-border dark:border-white/10",
                            "hover:bg-card/70 dark:hover:bg-white/10 hover:border-border/80 dark:hover:border-white/20",
                            inView ? 'animate-fade-in-up' : 'opacity-0'
                        )}
                        style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                           {step.icon}
                        </div>
                        <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};


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
              <h1 className={cn("text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline transition-all duration-1000", isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' )}>Mohamed Aref</h1>
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

        <div className="space-y-24 sm:space-y-32 my-24 sm:my-32">
          <PortfolioGrid />

          <AnimatedSection id="about" threshold={0.4}>
            <div className="grid gap-8 md:grid-cols-3 items-center">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <Avatar className="w-40 h-40 border-4 border-border/80 dark:border-white/20 shadow-lg mb-4">
                  <AvatarImage src="https://picsum.photos/seed/avatar/200/200" alt="Mohamed Aref" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold tracking-tighter font-headline">Mohamed Aref</h2>
                <p className="text-foreground/70 dark:text-white/70 mt-1 text-lg">Creative Developer & Designer</p>
              </div>
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tighter font-headline">About Me</h3>
                  <p className="text-foreground/80 dark:text-white/80 text-lg leading-relaxed">
                    I'm a passionate developer and designer with a knack for crafting elegant solutions to complex problems. I thrive on bringing ideas to life, from the initial concept all the way to a polished, performant product. My goal is to create digital experiences that are not only functional but also beautiful and intuitive.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tighter font-headline mb-4">My Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      'React', 'Next.js', 'Vue.js', 'TypeScript', 'Tailwind CSS',
                      'Node.js', 'GraphQL', 'PostgreSQL', 'Firebase',
                      'React Native', 'Flutter', 'Swift',
                      'Figma', 'Illustrator', 'UI/UX',
                      'Genkit', 'TensorFlow', 'Python',
                      'Git', 'CI/CD', 'Agile'
                    ].map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-foreground/10 text-foreground/80 dark:bg-white/10 dark:text-white/80 border-none text-sm py-1.5 px-4">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <ProcessSection />


          <AnimatedSection id="contact" threshold={0.4}>
              <ContactForm />
          </AnimatedSection>
        </div>
      </main>
      <SocialFab />
      <Footer />
    </div>
  );
}

    

    

