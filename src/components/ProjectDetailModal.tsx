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
              <DialogDescription className="text-white/80 text-base sm:text-lg leading-relaxed max-h-48 overflow-y-auto pt-4">
                {project.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                    <Button key={i} variant="ghost" size="sm" className="btn-glass rounded-full text-sm font-medium pointer-events-none">
                        {tag}
                    </Button>
                    ))}
                </div>
                {project.link && (
                    <Button asChild className={cn("btn-glass rounded-full text-base ml-4 shrink-0")}>
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
