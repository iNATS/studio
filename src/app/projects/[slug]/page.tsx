'use client';

import { portfolioItems, PortfolioItem } from '@/components/landing/Portfolio';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = portfolioItems.find(p => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full pt-24 sm:pt-32 pb-24">
        <div className="container max-w-5xl mx-auto px-4">
          <Button asChild className={cn("btn-glass rounded-full text-base mb-8")}>
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>

          <div className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border border-border/40 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                data-ai-hint={project.hint}
                priority
              />
            </div>
            <div className="p-6 sm:p-10">
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground mb-4">{project.title}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-sm font-medium pointer-events-none">
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="prose prose-lg max-w-none text-foreground/80 dark:text-white/80 dark:prose-invert">
                <p>{project.fullDescription}</p>
              </div>
              {project.link && project.link !== '#' && (
                 <div className="mt-8">
                    <Button asChild size="lg" className="btn-glass rounded-full text-base hover:scale-105 shadow-lg">
                        <Link href={project.link} target="_blank">
                            Visit Live Site
                        </Link>
                    </Button>
                 </div>
              )}
            </div>
          </div>

          {project.screenshots && project.screenshots.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-center mb-8">Project Gallery</h2>
              <div className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border border-border/40 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {project.screenshots.map((screenshot, index) => (
                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/20 shadow-lg group">
                      <Image
                        src={screenshot}
                        alt={`${project.title} screenshot ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
