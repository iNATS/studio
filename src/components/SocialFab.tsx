'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, MessageSquare, Twitter, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function SocialFab() {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: '#',
      icon: <Linkedin strokeWidth={2.5} />,
    },
    {
      label: 'Github',
      href: '#',
      icon: <Github strokeWidth={2.5} />,
    },
    {
      label: 'Twitter',
      href: '#',
      icon: <Twitter strokeWidth={2.5} />,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      {socialLinks.map((link, index) => (
        <Button
          key={link.label}
          asChild
          size="icon"
          variant="outline"
          className={cn(
            'rounded-full w-14 h-14 bg-background/60 backdrop-blur-sm border border-border/40 text-foreground/80 hover:bg-foreground/10 hover:text-foreground shadow-lg transition-all duration-300 ease-in-out',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          )}
          style={{ transitionDelay: isOpen ? `${index * 50}ms` : `${(socialLinks.length - index - 1) * 50}ms` }}
          aria-label={link.label}
        >
          <Link href={link.href} target="_blank" rel="noreferrer">
            {link.icon}
          </Link>
        </Button>
      ))}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full shadow-lg bg-background/60 backdrop-blur-sm border border-border/40 text-foreground/80 hover:bg-foreground/10 hover:text-foreground w-14 h-14"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle social media links"
      >
        <div className="relative h-full w-full flex items-center justify-center">
          <MessageSquare
            strokeWidth={2.5}
            className={cn(
              'absolute transition-all duration-300 ease-in-out',
              isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <X
            strokeWidth={2.5}
            className={cn(
              'absolute transition-all duration-300 ease-in-out',
              isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>
      </Button>
    </div>
  );
}
