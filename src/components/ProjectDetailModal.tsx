'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: PortfolioItem | null;
}

export function ProjectDetailModal({ isOpen, onOpenChange, project }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/60 dark:bg-black/20 backdrop-blur-2xl border-border/40 dark:border-white/20 sm:max-w-4xl p-0 rounded-3xl overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative h-64 md:h-full min-h-[300px] md:min-h-[500px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              data-ai-hint={project.hint}
            />
          </div>
          <div className="flex flex-col">
            <div className="p-6 sm:p-10 flex-grow">
              <DialogHeader className="text-left">
                <DialogTitle className="text-3xl md:text-4xl font-bold font-headline text-foreground">{project.title}</DialogTitle>
              </DialogHeader>
              <DialogDescription asChild className="text-foreground/80 text-base sm:text-lg leading-relaxed pt-4">
                <div>
                  {project.description}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, i) => (
                      <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-sm font-medium pointer-events-none">
                          {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </DialogDescription>
            </div>
            
            <div className="px-6 sm:px-10 pb-6 mt-auto pt-8">
              {project.link && (
                  <Button asChild className={cn("btn-glass rounded-full text-base w-full")}>
                      <Link href={project.link} target="_blank">
                      Open Project
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
