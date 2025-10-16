
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
  BarChart2,
  ListTodo,
  LayoutGrid
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
  isToday as isTodayDateFns,
  add,
  eachMonthOfInterval,
} from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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


const ProjectsOverviewChart = ({ projects }: { projects: Project[] }) => {
    const nextSixMonths = eachMonthOfInterval({
        start: startOfMonth(new Date()),
        end: add(new Date(), { months: 5 }),
      });
    
      const projectsPerMonth = nextSixMonths.map(month => {
        const projectsInMonth = projects.filter(project =>
          isWithinInterval(month, { start: startOfMonth(project.startDate), end: endOfMonth(project.endDate) })
        );
        return {
          name: format(month, 'MMM'),
          projects: projectsInMonth.length,
        };
      });

    return (
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="text-white/90 text-lg flex items-center gap-2"><BarChart2 className="w-5 h-5"/>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={projectsPerMonth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsla(180, 80%, 70%, 0.5)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsla(180, 80%, 70%, 0)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.1)" />
                        <XAxis dataKey="name" stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0, 0, 0, 0.8)',
                                border: '1px solid hsla(0,0%,100%,0.1)',
                                borderRadius: '0.75rem',
                                color: '#fff',
                            }}
                            cursor={{ fill: 'hsla(0,0%,100%,0.1)' }}
                         />
                        <Bar dataKey="projects" fill="url(#colorProjects)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


const OngoingProjectsList = ({ projects, onHover }: { projects: Project[], onHover: (id: string | null) => void }) => {
    return (
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="text-white/90 text-lg flex items-center gap-2"><LayoutGrid className="w-5 h-5"/>Ongoing Projects</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
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
                                <Progress value={progress} className="h-1 mt-2 bg-white/10" indicatorClassName={getProjectColor(project.id)} />
                            </motion.div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

const UpcomingTasksList = ({ tasks, onHover }: { tasks: Task[], onHover: (id: string | null) => void }) => {
    return (
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="text-white/90 text-lg flex items-center gap-2"><ListTodo className="w-5 h-5"/>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {tasks.map(task => (
                        <motion.div 
                            key={task.id}
                            onMouseEnter={() => onHover(task.id)}
                            onMouseLeave={() => onHover(null)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <Circle className={cn("h-2.5 w-2.5 flex-shrink-0", getTaskColor(task.priority))} fill="currentColor" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white/80">{task.title}</p>
                                {task.dueDate && <p className="text-xs text-white/50">{format(task.dueDate, 'MMM d, yyyy')}</p>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


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


export default function TimelinePage() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [activeFilters, setActiveFilters] = React.useState({
    type: 'all',
    client: 'all',
  });
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  
  const firstDayOfGrid = startOfWeek(firstDayOfMonth);
  const lastDayOfGrid = endOfWeek(lastDayOfMonth);

  const days = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });

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

  const filteredEvents = React.useMemo(() => {
      const allEvents: TimelineEvent[] = [
        ...initialProjects.map((p) => ({ ...p, type: 'project' as const })),
        ...initialTasks.map((t) => ({ ...t, type: 'task' as const })),
      ];

      return allEvents.filter((event) => {
        const typeMatch =
          activeFilters.type === 'all' || event.type === activeFilters.type;
        const clientMatch =
          activeFilters.client === 'all' || event.clientId === activeFilters.client;
        
        if (event.type === 'project') {
          const project = event as Project;
          const gridInterval = { start: firstDayOfGrid, end: lastDayOfGrid };
          const projectInGrid = isWithinInterval(project.startDate, gridInterval) || 
                                isWithinInterval(project.endDate, gridInterval) ||
                                (project.startDate < firstDayOfGrid && project.endDate > lastDayOfGrid);
          return typeMatch && clientMatch && projectInGrid;
        }
        
        if (event.type === 'task') {
            const task = event as Task;
            return typeMatch && clientMatch && task.dueDate && isWithinInterval(task.dueDate, {start: firstDayOfGrid, end: lastDayOfGrid});
        }

        return false;
      });
  }, [activeFilters, firstDayOfGrid, lastDayOfGrid]);


  const getEventsForDay = (day: Date) => {
    const tasks = filteredEvents.filter(
      (event) =>
        event.type === 'task' &&
        isSameDay(day, (event as Task).dueDate || new Date(0))
    ) as Task[];

    return { tasks };
  };

  const dayGridRef = React.useRef<HTMLDivElement>(null);
  const [projectPositions, setProjectPositions] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    const newPositions: Record<string, number> = {};
    const weekSlots: Record<number, string[]> = {};
  
    const projects = filteredEvents.filter(e => e.type === 'project') as Project[];
  
    projects.forEach(project => {
      const startWeek = Math.floor(differenceInDays(project.startDate, firstDayOfGrid) / 7);
      const endWeek = Math.floor(differenceInDays(project.endDate, firstDayOfGrid) / 7);

      let slot = 0;
      while (true) {
        let isOccupied = false;
        for (let week = startWeek; week <= endWeek; week++) {
          if (weekSlots[week]?.[slot]) {
            isOccupied = true;
            break;
          }
        }
        if (!isOccupied) {
          for (let week = startWeek; week <= endWeek; week++) {
            if (!weekSlots[week]) weekSlots[week] = [];
            weekSlots[week][slot] = project.id;
          }
          newPositions[project.id] = slot;
          break;
        }
        slot++;
      }
    });

    setProjectPositions(newPositions);
  }, [filteredEvents, firstDayOfGrid]);


  const ongoingProjects = initialProjects.filter(p => p.status === 'in-progress');
  const upcomingTasks = initialTasks.filter(t => t.status !== 'done' && t.dueDate && isWithinInterval(t.dueDate, { start: new Date(), end: add(new Date(), {days: 7})}));

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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
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

            <div ref={dayGridRef} className="grid grid-cols-7 gap-px flex-1 min-h-0 bg-white/5 p-px rounded-xl border border-white/10 relative">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-white/50 py-2"
                >
                  {day}
                </div>
              ))}
              
              {days.map((day, dayIdx) => {
                const { tasks } = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isTodayDateFns(day);
                
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      'relative flex flex-col p-1.5 bg-black/10 rounded-lg min-h-[120px] transition-colors',
                      isCurrentMonth ? '' : 'opacity-40',
                      isToday && 'bg-blue-500/10'
                    )}
                  >
                    <time
                      dateTime={format(day, 'yyyy-MM-dd')}
                      className={cn(
                        'text-xs font-semibold flex items-center justify-center h-6 w-6 rounded-full ml-auto transition-colors',
                        isToday
                          ? 'bg-blue-500 text-white'
                          : 'text-white/70'
                      )}
                    >
                      {format(day, 'd')}
                    </time>
                    <div className="flex-1 space-y-1 mt-1">
                      {tasks.map((t) => (
                        <EventPopover key={t.id} event={t}>
                          <motion.div
                            onMouseEnter={() => setHoveredEvent(t.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: dayIdx * 0.02 }}
                            className={cn(
                                "flex items-center gap-1.5 p-1 rounded-md cursor-pointer hover:bg-white/10 transition-colors z-20",
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
              
              {(filteredEvents.filter(e => e.type === 'project') as Project[]).map(p => {
                 const startDayInGrid = p.startDate > firstDayOfGrid ? p.startDate : firstDayOfGrid;
                 const endDayInGrid = p.endDate < lastDayOfGrid ? p.endDate : lastDayOfGrid;
                 
                 const startIndex = differenceInDays(startDayInGrid, firstDayOfGrid);
                 const duration = differenceInDays(endDayInGrid, startDayInGrid) + 1;
 
                 if (duration <= 0) return null;
 
                 const startCol = (startIndex % 7) + 1;
                 const topOffset = (projectPositions[p.id] || 0) * 28 + 48;
                 const startRow = Math.floor(startIndex / 7) + 2;

                return (
                    <EventPopover key={p.id} event={p}>
                        <motion.div
                            onMouseEnter={() => setHoveredEvent(p.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            style={{ 
                                top: `${topOffset}px`,
                                gridColumn: `${startCol} / span ${duration > 0 ? duration : 1}`,
                                gridRow: `${startRow}`,
                            }}
                            className={cn(
                                "absolute h-6 text-white text-[10px] font-medium flex items-center px-1.5 select-none rounded-sm transition-all duration-200 z-10",
                                getProjectColor(p.id),
                                hoveredEvent === p.id && 'ring-2 ring-white/80 scale-105 z-20',
                                p.startDate >= firstDayOfGrid && 'rounded-l-md',
                                p.endDate <= lastDayOfGrid && 'rounded-r-md'
                            )}
                        >
                            <span className="truncate">{p.title}</span>
                        </motion.div>
                    </EventPopover>
                );
              })}

            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
            <AnimatePresence>
                <motion.div key="projects-overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <ProjectsOverviewChart projects={initialProjects} />
                </motion.div>
                <motion.div key="ongoing-projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <OngoingProjectsList projects={ongoingProjects} onHover={setHoveredEvent} />
                </motion.div>
                <motion.div key="upcoming-tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <UpcomingTasksList tasks={upcomingTasks} onHover={setHoveredEvent} />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
