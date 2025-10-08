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
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

const AnimatedChar = ({ char, delay }: { char: string; delay: number }) => (
  <span
    className="animate-char-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    {char === ' ' ? '\u00A0' : char}
  </span>
);

const AnimatedText = ({ text, el: El = 'p', className, stagger = 30 }: { text: string, el?: keyof JSX.IntrinsicElements, className?: string, stagger?: number }) => {
  return (
    <El className={cn("flex", className)}>
      {text.split('').map((char, i) => (
        <AnimatedChar key={`${char}-${i}`} char={char} delay={i * stagger} />
      ))}
    </El>
  );
};


const PortfolioGrid = () => {
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' ? portfolioItems : portfolioItems.filter((item) => item.category === filter);

  const filterButtonStyle =
    'rounded-full backdrop-blur-sm border-white/20 shadow-lg transition-all duration-300';
  const activeFilterButtonStyle = 'bg-primary/80 text-primary-foreground';
  const inactiveFilterButtonStyle =
    'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white';

  return (
    <section id="projects" className="container py-24 sm:py-32">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-center">My Work</h2>
      <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed text-center mt-4">
        A selection of projects that I'm proud of.
      </p>
      <div className="flex justify-center gap-2 mt-8">
        <Button
          className={cn(filterButtonStyle, filter === 'all' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'web' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => setFilter('web')}
        >
          Web
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'mobile' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => setFilter('mobile')}
        >
          Mobile
        </Button>
        <Button
          className={cn(filterButtonStyle, filter === 'design' ? activeFilterButtonStyle : inactiveFilterButtonStyle)}
          onClick={() => setFilter('design')}
        >
          Design
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {filteredItems.map((item, index) => (
          <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="p-0">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={item.hint}
              />
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold font-headline">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <section className="relative w-full min-h-[80vh] flex items-center justify-center text-center overflow-hidden rounded-3xl backdrop-blur-sm border border-white/10 shadow-lg bg-white/5">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl animate-blob-1" />
            <div className="absolute w-[250px] h-[250px] bg-accent/20 rounded-full blur-3xl animate-blob-2" />
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-4">
                <AnimatedText text="Mohamed Aref" el="h1" className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline justify-center" stagger={50} />
                <AnimatedText text="Creative Developer & Designer" el="p" className="text-xl md:text-2xl font-medium text-primary justify-center" stagger={20} />
                <p className="max-w-[700px] text-muted-foreground md:text-xl animate-fade-in-up animation-delay-500">
                  I build beautiful, functional, and user-centric digital experiences. Let's create something
                  amazing together.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row animate-fade-in-up animation-delay-700">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105">
                  <a href="#contact">Get in Touch</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-transform hover:scale-105">
                  <Link href="/vibe-check">
                    Try AI Vibe Check <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <PortfolioGrid />

        <section id="about" className="w-full py-24 sm:py-32 rounded-3xl backdrop-blur-sm border border-white/10 shadow-lg bg-white/5 my-16">
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
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Code className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Web Development</h3>
                <p className="text-muted-foreground text-center">
                  Building responsive and scalable web applications with modern technologies.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Film className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Mobile Apps</h3>
                <p className="text-muted-foreground text-center">
                  Creating cross-platform mobile experiences that engage and delight users.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Palette className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">UI/UX Design</h3>
                <p className="text-muted-foreground text-center">
                  Designing intuitive and beautiful interfaces that focus on user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full py-24 sm:py-32">
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
        </section>
      </main>
      <SocialFab />
      <Footer />
    </div>
  );
}
