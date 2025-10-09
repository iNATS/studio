'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { PortfolioItem } from '@/app/page';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: PortfolioItem | null;
}

export function ProjectDetailModal({ isOpen, onOpenChange, project }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/50 backdrop-blur-2xl border-white/20 text-white sm:max-w-[800px] p-0 rounded-2xl shadow-2xl">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={project.image}
            alt={project.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <DialogHeader className="p-6 md:p-8 text-left">
          <DialogTitle className="text-3xl font-bold font-headline text-white">{project.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 py-4">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-white/20 text-white border-none text-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <DialogDescription className="text-white/80 text-base leading-relaxed">
            {project.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
