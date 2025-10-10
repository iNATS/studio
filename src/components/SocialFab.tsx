'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, MessageSquare, Share2, Twitter, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function SocialFab() {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: '#',
      icon: <Linkedin />,
    },
    {
      label: 'Github',
      href: '#',
      icon: <Github />,
    },
    {
      label: 'Twitter',
      href: '#',
      icon: <Twitter />,
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
            'rounded-full w-14 h-14 bg-background/50 backdrop-blur-lg border-border/50 text-foreground/80 hover:bg-background/70 shadow-lg transition-all duration-300 ease-in-out',
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
        variant="outline"
        className="rounded-full shadow-lg bg-background/50 backdrop-blur-lg border-border/50 text-foreground/80 hover:bg-background/70 w-14 h-14"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle social media links"
      >
        <div className="relative">
          <MessageSquare
            className={cn(
              'absolute inset-0 transition-all duration-300 ease-in-out',
              isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <X
            className={cn(
              'absolute inset-0 transition-all duration-300 ease-in-out',
              isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>
      </Button>
    </div>
  );
}
