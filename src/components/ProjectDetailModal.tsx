'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { PortfolioItem } from '@/components/landing/Portfolio';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: PortfolioItem | null;
}

export function ProjectDetailModal({ isOpen, onOpenChange, project }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/80 dark:bg-black/80 backdrop-blur-2xl border-white/20 shadow-2xl sm:max-w-5xl p-0 rounded-3xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 sm:min-h-[500px] flex flex-col">
        <div className="grid md:grid-cols-2 flex-1">
          <div className="relative h-64 md:h-auto w-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              objectFit="cover"
              className="md:rounded-l-3xl"
              data-ai-hint={project.hint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          </div>
          <div className="p-8 md:p-10 flex flex-col">
            <DialogHeader className="text-left flex-1 flex flex-col">
              <DialogTitle className="text-4xl font-bold font-headline text-foreground dark:text-white">{project.title}</DialogTitle>
              <div className="flex flex-wrap gap-2 py-4">
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-foreground/10 text-foreground/80 dark:bg-white/10 dark:text-white/80 border-none text-sm font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
              <DialogDescription className="text-foreground/80 dark:text-white/80 text-base sm:text-lg leading-relaxed flex-grow">
                {project.description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
