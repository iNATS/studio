'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, MessageSquare, Phone, Twitter, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

export function SocialFab() {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
        label: 'Phone',
        href: '#',
        icon: <Phone strokeWidth={2.5} className="h-6 w-6" />,
      },
    {
      label: 'WhatsApp',
      href: '#',
      icon: <WhatsAppIcon strokeWidth={2.5} className="h-6 w-6" />,
    },
    {
        label: 'Facebook',
        href: '#',
        icon: <FacebookIcon strokeWidth={2.5} className="h-6 w-6" />,
      },
      {
        label: 'Instagram',
        href: '#',
        icon: <InstagramIcon strokeWidth={2.5} className="h-6 w-6" />,
      },
    {
      label: 'LinkedIn',
      href: '#',
      icon: <Linkedin strokeWidth={2.5} className="h-6 w-6" />,
    },
    {
      label: 'Github',
      href: '#',
      icon: <Github strokeWidth={2.5} className="h-6 w-6" />,
    },
    {
      label: 'Twitter',
      href: '#',
      icon: <Twitter strokeWidth={2.5} className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">
      {socialLinks.map((link, index) => (
        <Button
          key={link.label}
          asChild
          size="icon"
          variant="ghost"
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
              'absolute transition-all duration-300 ease-in-out h-6 w-6',
              isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <X
            strokeWidth={2.5}
            className={cn(
              'absolute transition-all duration-300 ease-in-out h-6 w-6',
              isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>
      </Button>
    </div>
  );
}
