
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PageContentPage() {
  return (
    <main className="flex flex-col h-full pt-4">
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
            <h1 className="text-2xl font-bold text-white">Page Content</h1>
        </div>
      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white/90">Manage Landing Page</CardTitle>
          <CardDescription className="text-white/60">
            Update the content for the different sections of your landing page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/80">Content management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
