import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeadlinePage() {
  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
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
