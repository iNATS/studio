
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <main className="flex flex-col h-full pt-4">
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
            <h1 className="text-2xl font-bold text-white">Reports</h1>
        </div>
      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white/90">Analytics & Reports</CardTitle>
          <CardDescription className="text-white/60">
            View insights and performance metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/80">Reporting functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
