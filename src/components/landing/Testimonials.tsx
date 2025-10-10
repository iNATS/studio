'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Quote } from 'lucide-react';

const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Innovate Inc.',
      feedback: 'Working with Mohamed was a game-changer. His creative vision and technical expertise brought our project to life in ways we couldn\'t have imagined. A true professional and a pleasure to collaborate with.',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    {
      name: 'Michael Chen',
      company: 'Tech Solutions',
      feedback: 'The mobile app he developed for us exceeded all expectations. It\'s intuitive, fast, and beautifully designed. Our user engagement has skyrocketed since launch.',
      avatar: 'https://picsum.photos/seed/michael/100/100',
    },
    {
      name: 'Emily Davis',
      company: 'Creative Studio',
      feedback: 'I was blown away by the branding work. The new identity is modern, memorable, and perfectly captures our company\'s essence. I couldn\'t be happier with the result.',
      avatar: 'https://picsum.photos/seed/emily/100/100',
    },
    {
      name: 'David Rodriguez',
      company: 'Startup Hub',
      feedback: 'His ability to translate complex ideas into a simple, elegant user interface is remarkable. The SaaS dashboard he designed is both powerful and incredibly easy to use.',
      avatar: 'https://picsum.photos/seed/david/100/100',
    },
    {
      name: 'Jessica Lee',
      company: 'E-commerce Co.',
      feedback: 'Our new e-commerce platform is fantastic. It\'s robust, scalable, and the custom CMS is a dream to work with. Sales have increased significantly since we launched.',
      avatar: 'https://picsum.photos/seed/jessica/100/100',
    },
    {
      name: 'Chris Taylor',
      company: 'Health & Wellness',
      feedback: 'The fitness app has received overwhelmingly positive feedback from our users. The attention to detail in both design and functionality is evident throughout the entire experience.',
      avatar: 'https://picsum.photos/seed/chris/100/100',
    },
  ];

const AnimatedSection = ({ id, children, className, threshold = 0.2 }: { id?: string, children: React.ReactNode, className?: string, threshold?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { triggerOnce: false, threshold: threshold });
  
    return (
      <section ref={sectionRef} id={id} className={cn("py-24 sm:py-32", className, inView ? 'animate-fade-in-up' : 'opacity-0')}>
        {children}
      </section>
    )
}

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <AnimatedSection id="testimonials" threshold={0.1} className="px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">What My Clients Say</h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed max-w-2xl mx-auto">
            Kind words from people I've had the pleasure to work with.
          </p>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full mx-auto max-w-[400px]">
                  <Card className="h-full flex flex-col justify-between bg-card/60 dark:bg-white/5 backdrop-blur-2xl border border-border/50 dark:border-white/10 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-border dark:hover:border-white/20 overflow-hidden">
                    <CardContent className="p-6 flex-grow relative">
                      <Quote className="absolute top-4 left-4 h-12 w-12 text-primary/10" />
                      <p className="relative z-10 text-foreground/80 dark:text-white/80 leading-relaxed pt-8">"{testimonial.feedback}"</p>
                    </CardContent>
                    <CardHeader className="flex flex-row items-center gap-4 pt-0 p-6 bg-foreground/5 dark:bg-white/5 border-t border-border/50 dark:border-white/10">
                      <Avatar className="w-12 h-12 border-2 border-border/80 dark:border-white/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-bold font-headline">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{testimonial.company}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                current === index ? 'w-4 bg-primary' : 'bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
