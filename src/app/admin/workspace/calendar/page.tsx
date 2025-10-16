
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, DollarSign, Filter, X } from 'lucide-react';
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
  parseISO,
  differenceInCalendarDays,
  isWithinInterval
} from 'date-fns';
import { initialProjects, Project } from '@/app/admin/workspace/projects/page';
import { initialTasks, Task } from '@/app/admin/workspace/tasks/page';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { clientsData } from '@/app/admin/workspace/clients/page';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

type CalendarEvent = {
  type: 'project' | 'task';
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  data: Project | Task;
};

const EventDetailsPopover = ({ event, children }: { event: CalendarEvent, children: React.ReactNode }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-80 bg-background/80 backdrop-blur-xl border-white/10 text-white">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium leading-none">{event.title}</h4>
                            <Badge variant="outline" className={cn(event.type === 'project' ? "border-blue-400/50 text-blue-400" : "border-orange-400/50 text-orange-400")}>{event.type}</Badge>
                        </div>
                        <p className="text-sm text-white/60">
                            {event.data.description}
                        </p>
                    </div>
                    { 'clientId' in event.data && event.data.clientId && (
                        <div className="flex items-center gap-4">
                            <User className="h-5 w-5 text-white/50" />
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={clientsData.find(c => c.id === event.data.clientId)?.avatar} />
                                    <AvatarFallback>{clientsData.find(c => c.id === event.data.clientId)?.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-white/80">{clientsData.find(c => c.id === event.data.clientId)?.name}</span>
                            </div>
                        </div>
                    )}
                    { 'budget' in event.data && (
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

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(new Date()));

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
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 }),
  });

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
    return filteredEvents.filter(event => isWithinInterval(day, { start: event.startDate, end: event.endDate }));
  };

  return (
    <main className="flex flex-col h-full pt-4">
      <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
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
                            <p className="text-sm text-white/60">Refine your calendar view.</p>
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
              <h2 className="text-lg font-semibold text-white w-32 text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto -mx-4 px-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 p-2 sm:p-4 overflow-hidden">
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/60 border-b border-white/10 pb-2">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1 h-[calc(100%-2.5rem)]">
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                
                return (
                <div
                  key={day.toString()}
                  className={cn(
                    'border border-transparent hover:border-white/10 rounded-lg p-1.5 flex flex-col relative transition-colors duration-300',
                    isSameMonth(day, currentMonth) ? 'bg-white/5' : 'bg-black/10 text-white/40'
                  )}
                >
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={cn(
                      'flex items-center justify-center h-6 w-6 rounded-full font-semibold text-xs',
                      isToday(day) && 'bg-primary text-primary-foreground',
                      !isSameMonth(day, currentMonth) && 'text-white/30'
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                  <div className="mt-1 space-y-0.5 flex-1 overflow-y-auto pr-1">
                     <AnimatePresence>
                       {dayEvents.map((event, index) => {
                           if (isSameDay(day, event.startDate) || (getDay(day) === 0 && isWithinInterval(day, { start: event.startDate, end: event.endDate }))) {
                            const remainingDaysInWeek = 7 - getDay(day);
                            const eventDurationInDays = differenceInCalendarDays(event.endDate, event.startDate) + 1;
                            const eventStartOffset = isWithinInterval(day, { start: event.startDate, end: event.endDate }) ? 0 : differenceInCalendarDays(day, event.startDate);
                            const daysLeftInEvent = eventDurationInDays - eventStartOffset;
                            const segmentDuration = Math.min(daysLeftInEvent, remainingDaysInWeek);
                            const isTask = event.type === 'task' || isSameDay(event.startDate, event.endDate);

                            return (
                                <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={!isTask ? { width: `calc(${segmentDuration * 100}% + ${(segmentDuration - 1) * 4}px)` } : {}}
                                className={cn("relative", isTask ? 'w-full' : 'z-10')}
                                >
                                <EventDetailsPopover event={event}>
                                    <div className={cn(
                                        "w-full text-left p-1 rounded-md text-xs truncate border hover:bg-opacity-40 cursor-pointer",
                                        event.type === 'project' ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "bg-orange-500/20 text-orange-300 border-orange-500/40"
                                    )}>
                                        {event.title}
                                    </div>
                                </EventDetailsPopover>
                                </motion.div>
                            );
                           }
                          return null
                       })}
                     </AnimatePresence>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

    