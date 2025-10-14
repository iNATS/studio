import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TasksPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white/90">Tasks</CardTitle>
          <CardDescription className="text-white/60">
            Keep track of your project tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/80">Task management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
