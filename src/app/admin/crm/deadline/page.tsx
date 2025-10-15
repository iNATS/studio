import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeadlinePage() {
  return (
    <main className="flex flex-col h-full">
        <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Deadlines</h1>
        </div>
      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white/90">Deadlines</CardTitle>
          <CardDescription className="text-white/60">
            Monitor upcoming project deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/80">Deadline tracking functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
