
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, FileText, DollarSign, X } from 'lucide-react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isWithinInterval,
  isSameDay,
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import { initialProjects, Project } from '@/app/admin/workspace/projects/page';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { clientsData } from '@/app/admin/workspace/clients/page';

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

const ProjectViewDialog = ({ project, open, onOpenChange }: { project: Project | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!project) return null;
    
    const client = clientsData.find(c => c.id === project.clientId);

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                    <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-white/50" />
                        <p className="text-white/80">{project.description}</p>
                    </div>
                     {client && (
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-white/50" />
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-white/80">{client.name}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <DollarSign className="h-5 w-5 text-white/50" />
                        <span className="text-white/80 font-semibold">{project.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Budget</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <CalendarIcon className="h-5 w-5 text-white/50" />
                        <div className="text-sm">
                            <p className="text-white/80">{format(project.startDate, "MMMM d, yyyy")} - {format(project.endDate, "MMMM d, yyyy")}</p>
                        </div>
                    </div>
                </div>
                 <DialogFooter className="mt-6">
                    <Button onClick={() => onOpenChange(false)} className="rounded-lg">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CalendarPage() {
  const [today, setToday] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [viewingProject, setViewingProject] = React.useState<Project | null>(null);

  const firstDayCurrentMonth = startOfMonth(today);
  
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  const nextMonth = () => setToday(addMonths(today, 1));
  const prevMonth = () => setToday(subMonths(today, 1));
  const goToToday = () => setToday(new Date());

  const projectsByDate = React.useMemo(() => {
    const map = new Map<string, Project[]>();
    initialProjects.forEach(project => {
        const projectDays = eachDayOfInterval({start: project.startDate, end: project.endDate});
        projectDays.forEach(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            if (!map.has(dateString)) {
                map.set(dateString, []);
            }
            map.get(dateString)!.push(project);
        });
    });
    return map;
  }, []);

  return (
    <main className="flex flex-col h-full pt-4">
      <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-lg" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-1 rounded-lg border border-white/20 p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={prevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-white w-32 text-center">
                {format(today, 'MMMM yyyy')}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col">
        <CardContent className="flex-1 p-2 sm:p-4 overflow-hidden">
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/60 border-b border-white/10 pb-2 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-1 h-[calc(100%-2.5rem)]">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={cn(
                  'border border-white/10 rounded-lg p-2 flex flex-col',
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  !isSameMonth(day, today) && 'bg-white/5 text-white/40'
                )}
              >
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={cn(
                    'flex items-center justify-center h-6 w-6 rounded-full font-semibold',
                    isToday(day) &&
                      'bg-primary text-primary-foreground',
                  )}
                >
                  {format(day, 'd')}
                </time>
                <div className="mt-2 space-y-1 flex-1 overflow-y-auto">
                   {(projectsByDate.get(format(day, 'yyyy-MM-dd')) || []).map(project => (
                     isSameDay(day, project.startDate) || (dayIdx % 7 === 0 && isWithinInterval(day, {start: project.startDate, end: project.endDate})) ? (
                        <button key={project.id} onClick={() => setViewingProject(project)} className="w-full text-left bg-blue-500/20 text-blue-300 p-1.5 rounded-md text-xs truncate border border-blue-500/40 hover:bg-blue-500/30">
                            {project.title}
                        </button>
                    ) : null
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ProjectViewDialog 
        project={viewingProject}
        open={!!viewingProject}
        onOpenChange={(isOpen) => !isOpen && setViewingProject(null)}
      />
    </main>
  );
}
