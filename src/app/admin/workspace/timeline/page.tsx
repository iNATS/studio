
'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Calendar as CalendarIcon,
  Circle,
  Clock,
} from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths,
  format,
  isWithinInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clientsData, initialProjects, initialTasks } from '../data';
import { Project, ProjectStatus } from '../projects/page';
import { Task, TaskPriority } from '../tasks/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TimelineEvent = (Project | Task) & { type: 'project' | 'task' };

const EventPopover = ({
  event,
  children,
}: {
  event: TimelineEvent;
  children: React.ReactNode;
}) => {
  const client = clientsData.find((c) => c.id === event.clientId);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 bg-background/70 backdrop-blur-2xl border-white/10 text-white"
        side="bottom"
        align="start"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                event.type === 'project'
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
                  : 'border-pink-400/40 bg-pink-400/10 text-pink-400'
              )}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            <h4 className="font-semibold text-white/90">{event.title}</h4>
            <p className="text-sm text-white/60">{event.description}</p>
          </div>
          <div className="space-y-2 text-sm">
            {client && (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-white/70">{client.name}</span>
              </div>
            )}
            {'dueDate' in event && event.dueDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/50" />
                <span className="text-white/70">
                  Due: {format(event.dueDate, 'MMM d, yyyy')}
                </span>
              </div>
            )}
            {'startDate' in event && 'endDate' in event && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-white/50" />
                <span className="text-white/70">
                  {format(event.startDate, 'MMM d')} -{' '}
                  {format(event.endDate, 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const getProjectColor = (projectId: string) => {
  const colors = [
    'bg-cyan-500/80',
    'bg-blue-500/80',
    'bg-indigo-500/80',
    'bg-purple-500/80',
    'bg-fuchsia-500/80',
    'bg-pink-500/80',
    'bg-rose-500/80',
  ];
  const hash = projectId
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const getTaskColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-400';
    case 'medium':
      return 'bg-orange-400';
    case 'low':
      return 'bg-blue-400';
    default:
      return 'bg-gray-400';
  }
};

export default function TimelinePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [activeFilters, setActiveFilters] = React.useState({
    type: 'all',
    client: 'all',
  });
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });
  const startingDay = getDay(start);

  const prevMonth = () => setCurrentDate((d) => subMonths(d, 1));
  const nextMonth = () => setCurrentDate((d) => addMonths(d, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({ type: 'all', client: 'all' });
  };
  const hasActiveFilters =
    activeFilters.type !== 'all' || activeFilters.client !== 'all';

  const allEvents: TimelineEvent[] = [
    ...initialProjects.map((p) => ({ ...p, type: 'project' as const })),
    ...initialTasks.map((t) => ({ ...t, type: 'task' as const })),
  ];

  const filteredEvents = allEvents.filter((event) => {
    const typeMatch =
      activeFilters.type === 'all' || event.type === activeFilters.type;
    const clientMatch =
      activeFilters.client === 'all' || event.clientId === activeFilters.client;
    return typeMatch && clientMatch;
  });

  const getEventsForDay = (day: Date) => {
    const projects = filteredEvents.filter(
      (event) =>
        event.type === 'project' &&
        isWithinInterval(day, {
          start: (event as Project).startDate,
          end: (event as Project).endDate,
        })
    ) as Project[];

    const tasks = filteredEvents.filter(
      (event) =>
        event.type === 'task' &&
        isSameDay(day, (event as Task).dueDate || new Date(0))
    ) as Task[];

    return { projects, tasks };
  };

  return (
    <main className="flex flex-col h-full pt-4">
      <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Timeline</h1>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 relative"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-400"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-72 bg-background/80 backdrop-blur-xl border-white/10 text-white"
                align="end"
              >
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-white/60">
                      Refine your timeline view.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label>Type</Label>
                      <Select
                        value={activeFilters.type}
                        onValueChange={(value) =>
                          handleFilterChange('type', value)
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 col-span-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="project">Projects</SelectItem>
                          <SelectItem value="task">Tasks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label>Client</Label>
                      <Select
                        value={activeFilters.client}
                        onValueChange={(value) =>
                          handleFilterChange('client', value)
                        }
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 col-span-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                          <SelectItem value="all">All Clients</SelectItem>
                          {clientsData.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="rounded-lg text-white/70 hover:text-white hover:bg-white/10 w-full justify-center"
                    >
                      <X className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col p-2 sm:p-4">
        <header className="flex items-center justify-between px-2 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white rounded-full"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white rounded-full"
              onClick={nextMonth}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={goToToday}
              className="rounded-lg h-8 px-3 text-sm"
            >
              Today
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-white text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </header>

        <div className="grid grid-cols-7 gap-px flex-1 min-h-0 bg-white/5 p-px rounded-xl border border-white/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-white/50 py-2"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-black/10 rounded-lg"></div>
          ))}
          {days.map((day, dayIdx) => {
            const { projects, tasks } = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const projectsForWeek = filteredEvents.filter(
              (e) =>
                e.type === 'project' &&
                isWithinInterval(e.startDate, {
                  start: startOfWeek(day, { weekStartsOn: 0 }),
                  end: endOfWeek(day, { weekStartsOn: 0 }),
                })
            ) as Project[];

            return (
              <div
                key={day.toString()}
                className={cn(
                  'relative flex flex-col p-1.5 bg-black/10 rounded-lg min-h-[120px]',
                  isSameMonth(day, currentDate) ? '' : 'opacity-40'
                )}
              >
                <time
                  dateTime={format(day, 'yyyy-MM-dd')}
                  className={cn(
                    'text-xs font-semibold flex items-center justify-center h-6 w-6 rounded-full ml-auto',
                    isToday
                      ? 'bg-blue-500 text-white'
                      : 'text-white/70'
                  )}
                >
                  {format(day, 'd')}
                </time>
                <div className="flex-1 space-y-1 mt-1 relative">
                  {projects.map((p, projectIndex) => {
                      const offset = projectsForWeek.findIndex(fp => fp.id === p.id);
                      const isStart = isSameDay(p.startDate, day) || getDay(day) === 0;
                      const isEnd = isSameDay(p.endDate, day) || getDay(day) === 6;
                      const duration = differenceInDays(p.endDate, p.startDate) + 1;
                      const dayOfWeek = getDay(day);
                      
                      return(
                          <EventPopover key={p.id} event={p}>
                            <motion.div
                                onMouseEnter={() => setHoveredEvent(p.id)}
                                onMouseLeave={() => setHoveredEvent(null)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: dayIdx * 0.01 }}
                                style={{ top: `${24 * (offset % 4)}px` }}
                                className={cn(
                                    "absolute left-0 right-0 h-5 text-white text-[10px] font-medium flex items-center px-1.5 select-none rounded-sm transition-all duration-200",
                                    getProjectColor(p.id),
                                    isStart ? 'ml-0.5' : '-ml-px',
                                    isEnd ? 'mr-0.5' : '-mr-px',
                                    hoveredEvent === p.id ? 'ring-2 ring-white/80 scale-105 z-10' : 'z-0'
                                )}
                                >
                                <span className="truncate">
                                    {(isStart || dayOfWeek === 0) && p.title}
                                </span>
                            </motion.div>
                          </EventPopover>
                      )
                  })}
                   {tasks.map((t) => (
                    <EventPopover key={t.id} event={t}>
                      <motion.div
                        onMouseEnter={() => setHoveredEvent(t.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: dayIdx * 0.02 }}
                        className={cn(
                            "flex items-center gap-1.5 p-1 rounded-md cursor-pointer hover:bg-white/10 transition-colors",
                            hoveredEvent === t.id && "bg-white/10"
                        )}
                      >
                        <Circle
                          className={cn(
                            'h-2 w-2 flex-shrink-0',
                            getTaskColor(t.priority)
                          )}
                          fill="currentColor"
                        />
                        <span className="text-[11px] font-medium text-white/80 truncate flex-1">
                          {t.title}
                        </span>
                      </motion.div>
                    </EventPopover>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
