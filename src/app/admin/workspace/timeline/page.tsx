
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, DollarSign, Filter, X, Clock, Zap, CheckCircle } from 'lucide-react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isSameDay,
  endOfWeek,
  startOfWeek,
  getDay,
  isWithinInterval,
  differenceInCalendarDays,
  isPast,
  isFuture
} from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { initialProjects, Project } from '../projects/page';
import { initialTasks, Task } from '../tasks/page';
import { clientsData } from '../data';


type CalendarEvent = (
    | { type: 'project'; data: Project }
    | { type: 'task'; data: Task }
  ) & {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
};

const EventDetailsPopover = ({ event, children, onOpenChange }: { event: CalendarEvent, children: React.ReactNode, onOpenChange: (open: boolean) => void }) => {
    const client = 'clientId' in event.data && event.data.clientId ? clientsData.find(c => c.id === event.data.clientId) : null;
    return (
        <Popover onOpenChange={onOpenChange}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</PopoverTrigger>
            <PopoverContent className="w-80 bg-background/80 backdrop-blur-xl border-white/10 text-white">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium leading-none">{event.title}</h4>
                            <Badge variant="outline" className={cn(event.type === 'project' ? "border-blue-400/50 text-blue-400 bg-blue-500/10" : "border-orange-400/50 text-orange-400 bg-orange-500/10")}>{event.type}</Badge>
                        </div>
                        <p className="text-sm text-white/60">
                            {event.data.description}
                        </p>
                    </div>
                    { client && (
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-white/50" />
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={client.avatar} />
                                    <AvatarFallback>{client.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-white/80">{client.name}</span>
                            </div>
                        </div>
                    )}
                    { event.type === 'project' && 'budget' in event.data && (
                        <div className="flex items-center gap-4">
                            <DollarSign className="h-5 w-5 text-white/50" />
                            <span className="text-white/80 font-semibold">{(event.data as Project).budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Budget</span>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="h-5 w-5 text-white/50" />
                        <div className="text-sm">
                            {isSameDay(event.startDate, event.endDate) ? 
                                <p className="text-white/80">{format(event.startDate, "MMMM d, yyyy")}</p>
                                : <p className="text-white/80">{format(event.startDate, "MMM d")} - {format(event.endDate, "MMM d, yyyy")}</p>
                            }
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const getProjectProgress = (project: Project) => {
    const totalDays = differenceInCalendarDays(project.endDate, project.startDate);
    if (totalDays <= 0) return isPast(project.endDate) ? 100 : 0;
    const daysPassed = differenceInCalendarDays(new Date(), project.startDate);
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
}


export default function TimelinePage() {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(new Date()));
  const [hoveredEventId, setHoveredEventId] = React.useState<string | null>(null);

  const [filters, setFilters] = React.useState<{
    type: 'all' | 'project' | 'task';
    clientId: 'all' | string;
  }>({
    type: 'all',
    clientId: 'all',
  });

  const firstDayCurrentMonth = currentMonth;
  
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(addMonths(firstDayCurrentMonth,1)), { weekStartsOn: 0 }),
  });
  
  // Ensure we have 6 full weeks
   while (days.length < 42) {
    days.push(addMonths(days[days.length - 1], 1));
  }
  if (days.length > 42) {
    days.splice(42);
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(startOfMonth(new Date()));

  const allEvents = React.useMemo<CalendarEvent[]>(() => {
    const projectEvents: CalendarEvent[] = initialProjects.map(p => ({
        type: 'project',
        id: `p-${p.id}`,
        title: p.title,
        startDate: p.startDate,
        endDate: p.endDate,
        data: p,
    }));
    const taskEvents: CalendarEvent[] = initialTasks
        .filter(t => t.dueDate)
        .map(t => ({
            type: 'task',
            id: `t-${t.id}`,
            title: t.title,
            startDate: t.dueDate!,
            endDate: t.dueDate!,
            data: t,
        }));
    return [...projectEvents, ...taskEvents].sort((a,b) => a.startDate.getTime() - b.startDate.getTime());
  }, []);

  const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: 'all', clientId: 'all' });
  };
  
  const hasActiveFilters = filters.type !== 'all' || filters.clientId !== 'all';

  const filteredEvents = React.useMemo(() => {
    return allEvents.filter(event => {
        const typeMatch = filters.type === 'all' || event.type === filters.type;
        const clientMatch = filters.clientId === 'all' || ('clientId' in event.data && event.data.clientId === filters.clientId);
        return typeMatch && clientMatch;
    });
  }, [allEvents, filters]);


  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => 
        isWithinInterval(day, { start: startOfDay(event.startDate), end: endOfDay(event.endDate) })
    );
  };
  
  const startOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  const endOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };

  const ongoingProjects = filteredEvents.filter(e => e.type === 'project' && e.data.status === 'in-progress') as CalendarEvent[];
  const upcomingTasks = filteredEvents.filter(e => e.type === 'task' && isFuture(e.startDate) && e.data.status !== 'done').slice(0, 5) as CalendarEvent[];

  const projectChartData = React.useMemo(() => {
    const monthCounts: {[key: string]: number} = {};
    filteredEvents.forEach(event => {
        if (event.type === 'project') {
            const monthKey = format(event.startDate, 'MMM yyyy');
            if (monthCounts[monthKey]) {
                monthCounts[monthKey]++;
            } else {
                monthCounts[monthKey] = 1;
            }
        }
    });
    return Object.entries(monthCounts).map(([name, count]) => ({name, count})).slice(-6);
  }, [filteredEvents]);

  return (
    <main className="flex flex-col h-full pt-4">
      <div className="sticky top-0 z-20 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Timeline</h1>
          <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="gap-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 relative">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                        {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400"></span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-background/80 backdrop-blur-xl border-white/10 text-white" align="end">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filters</h4>
                            <p className="text-sm text-white/60">Refine your timeline view.</p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label>Type</Label>
                                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 col-span-2">
                                        <SelectValue placeholder="Type..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                                        <SelectItem value="all">All Events</SelectItem>
                                        <SelectItem value="project">Projects</SelectItem>
                                        <SelectItem value="task">Tasks</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label>Client</Label>
                                <Select value={filters.clientId} onValueChange={(value) => handleFilterChange('clientId', value)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 col-span-2">
                                        <SelectValue placeholder="Client..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                                        <SelectItem value="all">All Clients</SelectItem>
                                        {clientsData.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="rounded-lg text-white/70 hover:text-white hover:bg-white/10 w-full justify-center">
                                <X className="mr-2 h-4 w-4" /> Clear Filters
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            <Button variant="outline" className="rounded-lg" onClick={goToToday}>Today</Button>
            <div className="flex items-center gap-1 rounded-lg border border-white/20 p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-lg font-semibold text-white px-2 text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto -mx-4 px-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col min-h-0">
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col p-2 sm:p-4">
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/60 border-b border-white/10 pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 grid-rows-6 gap-1 flex-1">
                {days.map((day, dayIdx) => {
                    const dayEvents = getEventsForDay(day);
                    return (
                    <motion.div
                        key={day.toString()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: dayIdx * 0.01 }}
                        className={cn(
                            'relative flex flex-col rounded-lg p-1.5 transition-colors duration-300',
                            isSameMonth(day, currentMonth) ? 'bg-white/5' : 'bg-black/10'
                        )}
                    >
                        <time
                        dateTime={format(day, 'yyyy-MM-dd')}
                        className={cn(
                            'flex items-center justify-center h-6 w-6 rounded-full font-semibold text-xs mb-1',
                            isToday(day) && 'bg-primary text-primary-foreground',
                            !isSameMonth(day, currentMonth) && 'text-white/30'
                        )}
                        >
                        {format(day, 'd')}
                        </time>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          {dayEvents.filter(e => e.type === 'task').map(event => (
                               <EventDetailsPopover key={event.id} event={event} onOpenChange={(open) => setHoveredEventId(open ? event.id : null)}>
                                <div className={cn("h-1.5 w-1.5 rounded-full mx-auto", "bg-orange-400", hoveredEventId === event.id && "ring-2 ring-orange-400 ring-offset-2 ring-offset-background/50")}/>
                               </EventDetailsPopover>
                           ))}
                          {filteredEvents.filter(e => e.type === 'project' && isSameDay(day, e.startDate)).map(event => {
                              const duration = differenceInCalendarDays(event.endDate, event.startDate) + 1;
                              const offset = 0;
                              return (
                                 <EventDetailsPopover key={event.id} event={event} onOpenChange={(open) => setHoveredEventId(open ? event.id : null)}>
                                    <div
                                      style={{ width: `calc(${duration * 100}% + ${duration - 1} * 0.25rem)` }}
                                      className={cn("h-6 text-left p-1 rounded-md text-xs truncate border hover:bg-opacity-40 cursor-pointer text-white flex items-center",
                                      "bg-blue-500/20 border-blue-500/40",
                                      hoveredEventId === event.id && "ring-2 ring-primary bg-blue-500/30"
                                    )}>
                                       <p className="truncate pl-1">{event.title}</p>
                                    </div>
                                </EventDetailsPopover>
                              )
                          })}
                        </div>
                    </motion.div>
                )})}
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-6">
            <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
                 <CardHeader>
                    <CardTitle className="text-white/90 text-lg flex items-center gap-2"><Clock className="h-5 w-5"/> Ongoing Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {ongoingProjects.map(event => {
                             const project = event.data as Project;
                             const progress = getProjectProgress(project);
                             return(
                            <motion.div 
                                key={event.id} 
                                className={cn("p-3 rounded-lg bg-white/5 border border-white/10 transition-all cursor-pointer", hoveredEventId === event.id && "ring-2 ring-primary bg-white/10")}
                                onMouseEnter={() => setHoveredEventId(event.id)}
                                onMouseLeave={() => setHoveredEventId(null)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-semibold text-white/80 truncate">{event.title}</h4>
                                    <span className="text-xs font-mono text-green-400">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5" />
                            </motion.div>
                        )})}
                        {ongoingProjects.length === 0 && <p className="text-sm text-white/50 text-center py-4">No ongoing projects found.</p>}
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-white/90 text-lg flex items-center gap-2"><Zap className="h-5 w-5"/> Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {upcomingTasks.map(event => (
                            <motion.div 
                                key={event.id} 
                                className={cn("p-3 rounded-lg flex justify-between items-center bg-white/5 border border-white/10 transition-all cursor-pointer", hoveredEventId === event.id && "ring-2 ring-primary bg-white/10")}
                                onMouseEnter={() => setHoveredEventId(event.id)}
                                onMouseLeave={() => setHoveredEventId(null)}
                            >
                                <p className="text-sm text-white/80">{event.title}</p>
                                <span className="text-xs text-white/50">{format(event.startDate, "MMM d")}</span>
                            </motion.div>
                        ))}
                         {upcomingTasks.length === 0 && <p className="text-sm text-white/50 text-center py-4">No upcoming tasks.</p>}
                    </div>
                </CardContent>
            </Card>
             <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-white/90 text-lg flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Projects Overview</CardTitle>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={projectChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorProjectsTimeline" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsla(210, 100%, 70%, 0.8)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsla(210, 100%, 70%, 0)" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.1)" />
                            <XAxis dataKey="name" stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={20} />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    border: '1px solid hsla(0,0%,100%,0.1)',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                }}
                                cursor={{ fill: 'hsla(0,0%,100%,0.1)' }}
                            />
                            <Bar dataKey="count" fill="url(#colorProjectsTimeline)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );

    