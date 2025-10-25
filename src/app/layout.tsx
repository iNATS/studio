import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CursorGlow } from '@/components/CursorGlow';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Mohamed Aref | Portfolio',
  description: 'Portfolio of Mohamed Aref, showcasing web development, mobile, and design projects. Includes an AI-powered feedback tool.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen font-sans')}>
        <FirebaseClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <div className="fixed inset-0 -z-50">
                <div className="absolute inset-0 -z-40 bg-background"></div>
                <div className="absolute inset-0 -z-30 bg-grid-pattern opacity-10"></div>
                <div className="absolute inset-x-0 top-0 h-1/2 -z-20 bg-gradient-to-b from-primary/10 to-transparent"></div>
                <div className="blob-c animation-delay-200"></div>
                <div className="blob-c animation-delay-400"></div>
              </div>
            <CursorGlow />
            {children}
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
