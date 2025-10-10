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
      <DialogContent className="bg-transparent border-none sm:max-w-4xl p-0 rounded-3xl overflow-hidden shadow-2xl min-h-[500px] md:min-h-[600px]">
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project.hint}
          />
           <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative flex flex-col justify-end h-full p-6 md:p-10">
          <div className="bg-black/40 dark:bg-black/50 backdrop-blur-2xl p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl ring-1 ring-black/10">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl md:text-4xl font-bold font-headline text-white">{project.title}</DialogTitle>
              <div className="flex flex-wrap gap-2 py-4">
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-white/10 text-white/80 border-none text-sm font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
              <DialogDescription className="text-white/80 text-base sm:text-lg leading-relaxed max-h-48 overflow-y-auto">
                {project.description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
