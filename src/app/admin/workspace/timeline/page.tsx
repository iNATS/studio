
'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Circle,
  BarChart2,
  ListTodo,
  LayoutGrid,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  isToday as isTodayDateFns,
  add,
  sub,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfQuarter,
  endOfQuarter,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { clientsData, initialProjects, initialTasks } from '../data';
import { Project, ProjectStatus } from '../projects/page';
import { Task, TaskPriority } from '../tasks/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';

type TimelineEvent = (Project | Task) & { type: 'project' | 'task' };

const getProjectColor = (projectId: string) => {
    const colors = [
      'from-cyan-400 to-blue-500', 'from-sky-400 to-indigo-500', 'from-violet-400 to-fuchsia-500',
      'from-purple-400 to-pink-500', 'from-rose-400 to-red-500', 'from-orange-400 to-amber-500',
      'from-lime-400 to-green-500',
    ];
    const hash = projectId.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
};

const getProjectStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in-progress':
        return <Badge variant="outline" className="text-orange-400 border-orange-400/40 bg-orange-400/10">In Progress</Badge>;
      case 'planning':
        return <Badge variant="outline" className="text-blue-400 border-blue-400/40 bg-blue-400/10">Planning</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-400 border-green-400/40 bg-green-400/10">Completed</Badge>;
    }
}

const OngoingProjectsList = ({ projects, onHover }: { projects: Project[], onHover: (id: string | null) => void }) => {
    return (
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="text-white/90 text-lg flex items-center gap-2"><LayoutGrid className="w-5 h-5"/>Projects</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                        {projects.map(project => {
                            const totalDays = differenceInDays(project.endDate, project.startDate) || 1;
                            const daysPassed = differenceInDays(new Date(), project.startDate);
                            const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

                            return (
                                <motion.div 
                                    key={project.id}
                                    onMouseEnter={() => onHover(project.id)}
                                    onMouseLeave={() => onHover(null)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-semibold text-white/80">{project.title}</h5>
                                        {getProjectStatusBadge(project.status)}
                                    </div>
                                    <Progress value={progress} className="h-1 mt-2 bg-white/10" indicatorClassName={`bg-gradient-to-r ${getProjectColor(project.id)}`} />
                                </motion.div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

const getUnitWidth = (view: 'week' | 'month' | 'quarter') => {
    switch(view) {
        case 'week': return 100;
        case 'month': return 30;
        case 'quarter': return 10;
    }
}

const GanttTimeline = ({ projects, view, currentDate, hoveredEvent }: { projects: Project[], view: 'week' | 'month' | 'quarter', currentDate: Date, hoveredEvent: string | null }) => {
    const unitWidth = getUnitWidth(view);

    const getTimelineInterval = () => {
        switch (view) {
            case 'week':
                return { start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) };
            case 'month':
                return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
            case 'quarter':
                return { start: startOfQuarter(currentDate), end: endOfQuarter(currentDate) };
        }
    };
    const { start: viewStart, end: viewEnd } = getTimelineInterval();
    const totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;

    const headers = React.useMemo(() => {
        switch (view) {
            case 'week':
                return eachDayOfInterval({ start: viewStart, end: viewEnd }).map(day => ({
                    label: format(day, 'E d'),
                    isToday: isTodayDateFns(day)
                }));
            case 'month':
                 return eachWeekOfInterval({ start: viewStart, end: viewEnd }, {weekStartsOn: 1}).map(weekStart => ({
                    label: `W${format(weekStart, 'w')}`,
                    isCurrent: isWithinInterval(new Date(), {start: weekStart, end: endOfWeek(weekStart, {weekStartsOn: 1})})
                 }));
            case 'quarter':
                return eachMonthOfInterval({ start: viewStart, end: viewEnd }).map(monthStart => ({
                    label: format(monthStart, 'MMM'),
                    isCurrent: isSameMonth(new Date(), monthStart)
                }));
        }
    }, [view, viewStart, viewEnd]);
    
    const projectPositions = React.useMemo(() => {
        const positions: { project: Project; top: number; left: number; width: number; }[] = [];
        const slots: Date[][] = [];

        const sortedProjects = [...projects].sort((a,b) => a.startDate.getTime() - b.startDate.getTime());

        sortedProjects.forEach(project => {
            let placed = false;
            for(let i = 0; i < slots.length; i++) {
                if (!slots[i].some(date => isWithinInterval(date, { start: project.startDate, end: sub(project.endDate, {days: 1}) }))) {
                    for(const day of eachDayOfInterval({start: project.startDate, end: project.endDate})) {
                        slots[i].push(day);
                    }
                    const projectStartOffset = differenceInDays(project.startDate, viewStart);
                    const projectDuration = differenceInDays(project.endDate, project.startDate) + 1;
                    positions.push({
                        project,
                        top: 2 + i * 2.75,
                        left: (projectStartOffset / totalDaysInView) * 100,
                        width: (projectDuration / totalDaysInView) * 100,
                    });
                    placed = true;
                    break;
                }
            }

            if (!placed) {
                const newSlot: Date[] = [];
                for(const day of eachDayOfInterval({start: project.startDate, end: project.endDate})) {
                    newSlot.push(day);
                }
                slots.push(newSlot);
                const projectStartOffset = differenceInDays(project.startDate, viewStart);
                const projectDuration = differenceInDays(project.endDate, project.startDate) + 1;

                positions.push({
                    project,
                    top: 2 + (slots.length - 1) * 2.75,
                    left: (projectStartOffset / totalDaysInView) * 100,
                    width: (projectDuration / totalDaysInView) * 100,
                });
            }
        })
        return positions;

    }, [projects, viewStart, viewEnd, totalDaysInView]);

    const containerHeight = 4 + (Math.max(...projectPositions.map(p => p.top)) + 2.75) + 'rem';
    
    return (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col p-2 sm:p-4 overflow-hidden">
             <div className="grid" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                {headers.map((header, i) => (
                    <div key={i} className={cn("text-center py-2 text-xs font-medium text-white/50 border-r border-white/10 last:border-r-0", (header as any).isToday || (header as any).isCurrent ? "text-blue-400" : "" )}>
                        {header.label}
                    </div>
                ))}
            </div>
            <ScrollArea className="flex-1">
                <div className="relative border-t border-white/10" style={{ height: projectPositions.length > 0 ? containerHeight : '100%'}}>
                    {projectPositions.map(({ project, top, left, width }) => {
                        if (project.endDate < viewStart || project.startDate > viewEnd) return null;

                        const startsBeforeView = project.startDate < viewStart;
                        const endsAfterView = project.endDate > viewEnd;
                        const finalLeft = Math.max(0, left);
                        const finalWidth = startsBeforeView ? width + left : width;

                        return (
                            <Popover key={project.id}>
                                <PopoverTrigger asChild>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.03, zIndex: 20, filter: 'brightness(1.1)' }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className={cn(
                                            "absolute h-8 text-white text-sm font-medium flex items-center px-3 select-none transition-all duration-200 z-10 bg-black/20 backdrop-blur-sm cursor-pointer shadow-inner-lg",
                                            `bg-gradient-to-r ${getProjectColor(project.id)}`,
                                            startsBeforeView ? 'rounded-r-lg' : 'rounded-lg',
                                            endsAfterView && !startsBeforeView ? 'rounded-l-lg rounded-r-none' : '',
                                            endsAfterView && startsBeforeView ? 'rounded-none' : '',
                                            hoveredEvent === project.id && 'ring-2 ring-white/80 scale-[1.03] z-20 brightness-110',
                                        )}
                                        style={{
                                            top: `${top}rem`,
                                            left: `${finalLeft}%`,
                                            width: `${Math.min(finalWidth, 100 - finalLeft)}%`,
                                        }}
                                    >
                                        <span className="truncate">{project.title}</span>
                                    </motion.div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-background/70 backdrop-blur-2xl border-white/10 text-white" side="bottom" align="start">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-white/90">{project.title}</h4>
                                        <p className="text-sm text-white/60">{project.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <CalendarIcon className="h-4 w-4 text-white/50" />
                                            <span>{format(project.startDate, 'MMM d')} - {format(project.endDate, 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default function TimelinePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);
  const [view, setView] = React.useState<'week' | 'month' | 'quarter'>('month');

  const moveDate = (direction: 'prev' | 'next') => {
    const amount = direction === 'prev' ? -1 : 1;
    switch (view) {
        case 'week':
            setCurrentDate(d => add(d, { weeks: amount }));
            break;
        case 'month':
            setCurrentDate(d => add(d, { months: amount }));
            break;
        case 'quarter':
            setCurrentDate(d => add(d, { quarters: amount }));
            break;
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const getLabelForCurrentDate = () => {
    switch (view) {
        case 'week':
            return `Week of ${format(startOfWeek(currentDate, {weekStartsOn: 1}), 'MMM d, yyyy')}`;
        case 'month':
            return format(currentDate, 'MMMM yyyy');
        case 'quarter':
            return `Q${format(currentDate, 'q')} ${format(currentDate, 'yyyy')}`;
    }
  }

  const projectsInView = React.useMemo(() => {
    const { start, end } = (() => {
        switch (view) {
            case 'week': return { start: startOfWeek(currentDate, {weekStartsOn: 1}), end: endOfWeek(currentDate, {weekStartsOn: 1}) };
            case 'month': return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
            case 'quarter': return { start: startOfQuarter(currentDate), end: endOfQuarter(currentDate) };
        }
    })();
    return initialProjects.filter(p => isWithinInterval(p.startDate, {start, end}) || isWithinInterval(p.endDate, {start, end}) || (p.startDate < start && p.endDate > end));
  }, [view, currentDate]);
  
  return (
    <main className="flex flex-col h-full pt-4">
      <div className="flex-shrink-0 sticky top-0 z-20 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Timeline</h1>
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={goToToday} className="rounded-lg h-9 px-3 text-sm">
                    Today
                </Button>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-white/10">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white rounded-md" onClick={() => moveDate('prev')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white rounded-md" onClick={() => moveDate('next')}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
                <h2 className="text-lg font-semibold text-white text-center w-48">
                    {getLabelForCurrentDate()}
                </h2>
                <ToggleGroup type="single" value={view} onValueChange={(v: 'week' | 'month' | 'quarter') => v && setView(v)} className="p-1 bg-white/10 rounded-lg">
                    <ToggleGroupItem value="week" aria-label="Week view" className="rounded-md px-3 text-white/70 data-[state=on]:bg-white/20 data-[state=on]:text-white">Week</ToggleGroupItem>
                    <ToggleGroupItem value="month" aria-label="Month view" className="rounded-md px-3 text-white/70 data-[state=on]:bg-white/20 data-[state=on]:text-white">Month</ToggleGroupItem>
                    <ToggleGroupItem value="quarter" aria-label="Quarter view" className="rounded-md px-3 text-white/70 data-[state=on]:bg-white/20 data-[state=on]:text-white">Quarter</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 -mx-4 px-4 pb-4 overflow-y-auto">
        <div className="xl:col-span-1 flex flex-col gap-6">
            <AnimatePresence>
                <motion.div key="ongoing-projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <OngoingProjectsList projects={initialProjects} onHover={setHoveredEvent} />
                </motion.div>
            </AnimatePresence>
        </div>
        <div className="xl:col-span-3 flex flex-col">
            <GanttTimeline projects={initialProjects} view={view} currentDate={currentDate} hoveredEvent={hoveredEvent}/>
        </div>
      </div>
    </main>
  );
}
