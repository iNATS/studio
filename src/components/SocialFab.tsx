import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function SocialFab() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button asChild size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90" aria-label="Twitter">
        <Link href="#" target="_blank" rel="noreferrer">
          <Twitter className="h-6 w-6 text-primary-foreground" />
        </Link>
      </Button>
      <Button asChild size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90" aria-label="Github">
        <Link href="#" target="_blank" rel="noreferrer">
          <Github className="h-6 w-6 text-primary-foreground" />
        </Link>
      </Button>
      <Button asChild size="icon" className="rounded-full shadow-lg bg-primary hover:bg-primary/90" aria-label="LinkedIn">
        <Link href="#" target="_blank" rel="noreferrer">
          <Linkedin className="h-6 w-6 text-primary-foreground" />
        </Link>
      </Button>
    </div>
  );
}
