
'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LayoutGrid,
  BarChart2,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
  isSameMonth,
  differenceInDays,
  isToday as isTodayDateFns,
  add,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfQuarter,
  endOfQuarter,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  sub,
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
import { initialProjects } from '../data';
import { Project, ProjectStatus } from '../projects/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        return <Badge variant="outline" className="text-orange-500 dark:text-orange-400 border-orange-500/40 dark:border-orange-400/40 bg-orange-500/10 dark:bg-orange-400/10">In Progress</Badge>;
      case 'planning':
        return <Badge variant="outline" className="text-blue-500 dark:text-blue-400 border-blue-500/40 dark:border-blue-400/40 bg-blue-500/10 dark:bg-blue-400/10">Planning</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 dark:text-green-400 border-green-500/40 dark:border-green-400/40 bg-green-500/10 dark:bg-green-400/10">Completed</Badge>;
    }
}

const OngoingProjectsList = ({ projects, onHover, onClick, activeProjectId }: { projects: Project[], onHover: (id: string | null) => void, onClick: (id: string) => void, activeProjectId: string | null }) => {
    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><LayoutGrid className="w-5 h-5"/>Projects</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-22rem)] sm:h-96">
                    <div className="space-y-4 pr-4">
                        {projects.map(project => {
                            const totalDays = differenceInDays(project.endDate, project.startDate) || 1;
                            const daysPassed = differenceInDays(new Date(), project.startDate);
                            const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

                            return (
                                <motion.div 
                                    key={project.id}
                                    id={`project-list-item-${project.id}`}
                                    onMouseEnter={() => onHover(project.id)}
                                    onMouseLeave={() => onHover(null)}
                                    onClick={() => onClick(project.id)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer",
                                        activeProjectId === project.id && "bg-black/10 dark:bg-white/10 ring-2 ring-blue-400"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-semibold text-zinc-800 dark:text-white/80">{project.title}</h5>
                                        {getProjectStatusBadge(project.status)}
                                    </div>
                                    <Progress value={progress} className="h-1 mt-2 bg-black/10 dark:bg-white/10" indicatorClassName={`bg-gradient-to-r ${getProjectColor(project.id)}`} />
                                </motion.div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

const ProjectsOverviewChart = ({ projects }: { projects: Project[] }) => {
    const projectsPerMonth = React.useMemo(() => {
        const months = Array.from({ length: 6 }).map((_, i) => addMonths(startOfMonth(new Date()), i));
        return months.map(month => {
            const projectsInMonth = projects.filter(p => isWithinInterval(month, { start: startOfMonth(p.startDate), end: endOfMonth(p.endDate) }));
            return {
                name: format(month, 'MMM'),
                count: projectsInMonth.length,
            };
        });
    }, [projects]);
    
    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
             <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5"/>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={projectsPerMonth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                background: 'hsla(var(--background), 0.8)',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '0.75rem',
                                color: 'hsl(var(--foreground))',
                            }}
                            cursor={{ fill: 'hsla(var(--primary-rgb), 0.1)' }}
                         />
                        <Bar dataKey="count" fill="url(#colorProjects)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const GanttTimeline = ({ projects, view, currentDate, hoveredEvent, onClick, activeProjectId }: { projects: Project[], view: 'week' | 'month' | 'quarter', currentDate: Date, hoveredEvent: string | null, onClick: (id: string) => void, activeProjectId: string | null }) => {
    const getTimelineInterval = React.useCallback(() => {
        switch (view) {
            case 'week':
                return { start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) };
            case 'month':
                return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
            case 'quarter':
                return { start: startOfQuarter(currentDate), end: endOfQuarter(currentDate) };
        }
    }, [view, currentDate]);

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
                        top: 1 + i * 2.25,
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
                    top: 1 + (slots.length - 1) * 2.25,
                    left: (projectStartOffset / totalDaysInView) * 100,
                    width: (projectDuration / totalDaysInView) * 100,
                });
            }
        })
        return positions;

    }, [projects, viewStart, viewEnd, totalDaysInView]);

    const containerHeight = 2 + (Math.max(0, ...projectPositions.map(p => p.top)) + 2.25) + 'rem';
    
    return (
        <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col p-2 sm:p-4 overflow-hidden">
             <div className="grid" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                {headers.map((header, i) => (
                    <div key={i} className={cn("text-center py-2 text-xs font-medium text-zinc-500 dark:text-white/50 border-r border-zinc-200/80 dark:border-white/10 last:border-r-0", (header as any).isToday || (header as any).isCurrent ? "text-blue-500 dark:text-blue-400" : "" )}>
                        {header.label}
                    </div>
                ))}
            </div>
            <ScrollArea className="flex-1">
                <div id="timeline-grid" className="relative border-t border-zinc-200/80 dark:border-white/10" style={{ height: projectPositions.length > 0 ? containerHeight : '100px'}}>
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
                                        id={`project-bar-${project.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.03, zIndex: 20, filter: 'brightness(1.2)' }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        onClick={() => onClick(project.id)}
                                        className={cn(
                                            "absolute h-6 text-white text-xs font-medium flex items-center px-2 select-none transition-all duration-200 z-10 bg-black/20 dark:bg-black/20 backdrop-blur-sm cursor-pointer shadow-inner",
                                            `bg-gradient-to-r ${getProjectColor(project.id)}`,
                                            startsBeforeView ? 'rounded-r-md' : 'rounded-md',
                                            endsAfterView && !startsBeforeView ? 'rounded-l-md rounded-r-none' : '',
                                            endsAfterView && startsBeforeView ? 'rounded-none' : '',
                                            (hoveredEvent === project.id || activeProjectId === project.id) && 'ring-2 ring-white/80 scale-[1.03] z-20 brightness-125',
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
                                <PopoverContent className="w-80 bg-background/70 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white" side="bottom" align="start">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-zinc-800 dark:text-white/90">{project.title}</h4>
                                        <p className="text-sm text-zinc-600 dark:text-white/60">{project.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-white/70">
                                            <CalendarIcon className="h-4 w-4 text-zinc-400 dark:text-white/50" />
                                            <span>{format(project.startDate, 'MMM d')} - {format(project.endDate, 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    })}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default function TimelinePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
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

  const handleProjectClick = (projectId: string) => {
    setActiveProjectId(projectId);
    const project = initialProjects.find(p => p.id === projectId);
    if(project) {
        // Center view on project start date if it's not in the current view
        const { start, end } = getTimelineInterval(view, currentDate);
        if(!isWithinInterval(project.startDate, { start, end })) {
            setCurrentDate(project.startDate);
        }
    }
    document.getElementById(`project-bar-${projectId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const getTimelineInterval = (view: 'week' | 'month' | 'quarter', date: Date) => {
    switch (view) {
        case 'week': return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
        case 'month': return { start: startOfMonth(date), end: endOfMonth(date) };
        case 'quarter': return { start: startOfQuarter(date), end: endOfQuarter(date) };
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

  return (
    <main className="flex flex-col h-full">
      <div className="flex-shrink-0 sticky top-0 z-20 bg-background/50 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Timeline</h1>
            <div className="flex items-center gap-2 flex-wrap">
                <Button variant="ghost" onClick={goToToday} className="rounded-lg h-9 px-3 text-sm">
                    Today
                </Button>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-black/5 dark:bg-white/10">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white rounded-md" onClick={() => moveDate('prev')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white rounded-md" onClick={() => moveDate('next')}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
                <h2 className="text-lg font-semibold text-center w-48 hidden sm:block">
                    {getLabelForCurrentDate()}
                </h2>
                <ToggleGroup type="single" value={view} onValueChange={(v: 'week' | 'month' | 'quarter') => v && setView(v)} className="p-1 bg-black/5 dark:bg-white/10 rounded-lg">
                    <ToggleGroupItem value="week" aria-label="Week view" className="rounded-md px-3 text-zinc-600 dark:text-white/70 data-[state=on]:bg-background dark:data-[state=on]:bg-zinc-900/80 data-[state=on]:text-foreground dark:data-[state=on]:text-white">Week</ToggleGroupItem>
                    <ToggleGroupItem value="month" aria-label="Month view" className="rounded-md px-3 text-zinc-600 dark:text-white/70 data-[state=on]:bg-background dark:data-[state=on]:bg-zinc-900/80 data-[state=on]:text-foreground dark:data-[state=on]:text-white">Month</ToggleGroupItem>
                    <ToggleGroupItem value="quarter" aria-label="Quarter view" className="rounded-md px-3 text-zinc-600 dark:text-white/70 data-[state=on]:bg-background dark:data-[state=on]:bg-zinc-900/80 data-[state=on]:text-foreground dark:data-[state=on]:text-white">Quarter</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 -mx-4 px-4 pb-4 overflow-y-auto">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <AnimatePresence>
                <motion.div key="ongoing-projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <OngoingProjectsList projects={initialProjects} onHover={setHoveredEvent} onClick={handleProjectClick} activeProjectId={activeProjectId} />
                </motion.div>
                <motion.div key="overview-chart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <ProjectsOverviewChart projects={initialProjects} />
                </motion.div>
            </AnimatePresence>
        </div>
        <div className="lg:col-span-3 flex flex-col">
            <GanttTimeline projects={initialProjects} view={view} currentDate={currentDate} hoveredEvent={hoveredEvent} onClick={setActiveProjectId} activeProjectId={activeProjectId} />
        </div>
      </div>
    </main>
  );
}
