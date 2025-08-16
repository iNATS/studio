import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VibeCheckTool } from '@/components/VibeCheckTool';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function VibeCheckPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="container max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
              AI Vibe Check
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
              Analyze your code or video edits with AI. Get constructive feedback to improve quality and save time.
            </p>
          </div>
          <VibeCheckTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
