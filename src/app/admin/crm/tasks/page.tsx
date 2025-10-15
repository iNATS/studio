
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, Edit, GripVertical, CalendarIcon, X as XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragOverEvent, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const clientsData = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: '2', name: 'Michael Chen', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { id: '3', name: 'Emily Davis', avatar: 'https://picsum.photos/seed/emily/100/100' },
    { id: '4', name: 'David Rodriguez', avatar: 'https://picsum.photos/seed/david/100/100' },
    { id: '5', name: 'Jessica Lee', avatar: 'https://picsum.photos/seed/jessica/100/100' },
];


export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  clientId?: string;
  tags?: string[];
};

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';


const initialTasks: Task[] = [
  { id: '1', title: 'Design Landing Page', description: 'Create mockups in Figma', status: 'in-progress', priority: 'high', clientId: '1', dueDate: new Date(2024, 6, 20), tags: ['design', 'UI'] },
  { id: '2', title: 'Develop API Endpoints', description: 'Setup new routes for user auth', status: 'todo', priority: 'high', clientId: '2', tags: ['backend'] },
  { id: '3', title: 'Fix Login Bug', description: 'Users reporting issues on mobile', status: 'in-progress', priority: 'medium', clientId: '3' },
  { id: '4', title: 'Write Documentation', description: 'For the new credit card processing feature', status: 'todo', priority: 'low', dueDate: new Date(2024, 7, 1) },
  { id: '5', title: 'Deploy Staging Server', description: 'Update server with latest build', status: 'done', priority: 'high', clientId: '1', tags: ['devops'] },
  { id: '6', title: 'Client Meeting Prep', description: 'Prepare slides for project update', status: 'done', priority: 'medium', clientId: '2' },
  { id: '7', title: 'Update Dependencies', description: 'Check for security vulnerabilities', status: 'todo', priority: 'low', tags: ['maintenance'] },
];

const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
        case 'high':
            return <Badge variant="outline" className="text-red-400 border-red-400/40 bg-red-400/10">High</Badge>;
        case 'medium':
            return <Badge variant="outline" className="text-orange-400 border-orange-400/40 bg-orange-400/10">Medium</Badge>;
        case 'low':
            return <Badge variant="outline" className="text-blue-400 border-blue-400/40 bg-blue-400/10">Low</Badge>;
    }
}

const TaskCard = ({ task, onEdit, onDelete }: { task: Task, onEdit: (task: Task) => void, onDelete: (task: Task) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: {type: 'Task', task} });
    const client = clientsData.find(c => c.id === task.clientId);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card className="bg-white/10 backdrop-blur-3xl border-white/20 shadow-lg rounded-xl mb-4 transition-shadow hover:shadow-2xl">
                <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2 flex-1">
                             <button {...listeners} className="flex-shrink-0 pt-1 text-white/40 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5" />
                            </button>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white/90">{task.title}</h4>
                                <p className="text-sm text-white/60 mt-1 mb-3">{task.description}</p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {getPriorityBadge(task.priority)}
                                    {task.tags?.map(tag => <Badge key={tag} variant="secondary" className="bg-white/10 text-white/70">{tag}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/50 mt-4">
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="h-4 w-4"/>
                                            <span>{format(task.dueDate, 'MMM d')}</span>
                                        </div>
                                    )}
                                    {client && (
                                        <div className="flex items-center gap-1.5">
                                             <Avatar className="h-5 w-5">
                                                <AvatarImage src={client.avatar} alt={client.name} />
                                                <AvatarFallback>{client.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{client.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-white/70 hover:bg-white/20 hover:text-white"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-background/80 backdrop-blur-xl border-white/10 text-white"
                        >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => onEdit(task)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white" onSelect={() => onDelete(task)}>
                              <Trash2 className="mr-2 h-4 w-4" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const TaskColumn = ({ title, status, tasks, onEdit, onDelete }: { title: string, status: TaskStatus, tasks: Task[], onEdit: (task: Task) => void, onDelete: (task: Task) => void }) => {
    const { setNodeRef, isOver } = useSortable({ id: status, data: { type: 'Column', status }});

    const tasksById = React.useMemo(() => tasks.map(t => t.id), [tasks]);

    return (
        <div ref={setNodeRef} className={cn("flex-1", isOver ? "ring-2 ring-primary ring-offset-2 ring-offset-background/50 rounded-2xl" : "")}>
            <h3 className="text-lg font-semibold text-white/90 mb-4 px-1">{title}</h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[500px]">
                <SortableContext items={tasksById} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete}/>)}
                </SortableContext>
            </div>
        </div>
    );
};

const TaskForm = ({ task, onSubmit }: { task?: Task, onSubmit: (values: any) => void }) => {
    const [dueDate, setDueDate] = React.useState<Date | undefined>(task?.dueDate);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        onSubmit({...values, dueDate});
    }
    
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" defaultValue={task?.title} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" defaultValue={task?.description} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
               <Select name="clientId" defaultValue={task?.clientId}>
                <SelectTrigger id="clientId" className="col-span-3 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    {clientsData.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "col-span-3 justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                        !dueDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-xl border-white/10 text-white" align="start">
                        <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
               <Select name="priority" defaultValue={task?.priority || 'medium'}>
                <SelectTrigger id="priority" className="col-span-3 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input id="tags" name="tags" defaultValue={task?.tags?.join(', ')} className="col-span-3 bg-white/5 border-white/10" placeholder="e.g. UI, backend, urgent" />
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit" className="rounded-lg">Save changes</Button>
            </div>
          </form>
    )
}

export default function TasksPage() {
    const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = React.useState<Task | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
    const { toast } = useToast();
    const sensors = useSensors(useSensor(PointerSensor));

    const [filters, setFilters] = React.useState({
        clientId: 'all',
        priority: 'all',
        tag: '',
    });

    const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];
    const columnTitles = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

    const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({ clientId: 'all', priority: 'all', tag: '' });
    };

    const filteredTasks = React.useMemo(() => {
        return tasks.filter(task => {
            const clientMatch = filters.clientId === 'all' || task.clientId === filters.clientId;
            const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
            const tagMatch = filters.tag === '' || task.tags?.some(t => t.toLowerCase().includes(filters.tag.toLowerCase()));
            return clientMatch && priorityMatch && tagMatch;
        });
    }, [tasks, filters]);


    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Task') {
            setActiveTask(active.data.current.task);
        }
    }, []);

    const handleDragOver = React.useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const updatedTask = {
                    ...currentTasks[activeIndex],
                    status: over.data.current?.status as TaskStatus,
                };
                const newTasks = [...currentTasks];
                newTasks[activeIndex] = updatedTask;

                return arrayMove(newTasks, activeIndex, activeIndex);
            });
        }
        
        const isOverATask = over.data.current?.type === "Task";
        if (isActiveATask && isOverATask) {
             setTasks(currentTasks => {
                const activeIndex = currentTasks.findIndex(t => t.id === activeId);
                const overIndex = currentTasks.findIndex(t => t.id === overId);
                
                if (currentTasks[activeIndex].status !== currentTasks[overIndex].status) {
                    currentTasks[activeIndex].status = currentTasks[overIndex].status;
                    return arrayMove(currentTasks, activeIndex, overIndex);
                }

                return arrayMove(currentTasks, activeIndex, overIndex);
            });
        }
    }, []);

    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
      setActiveTask(null);
    }, []);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const closeEditDialog = () => {
        setEditingTask(null);
    };

    const handleDeleteConfirm = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(t => t.id !== taskToDelete.id));
            setTaskToDelete(null);
            toast({
                variant: 'success',
                title: 'Task Removed',
                description: `"${taskToDelete.title}" has been removed.`,
            });
        }
    };

    const handleAddTask = (values: any) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: values.title,
            description: values.description,
            priority: values.priority,
            status: 'todo',
            clientId: values.clientId,
            dueDate: values.dueDate,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
        };
        setTasks([...tasks, newTask]);
        setIsAddDialogOpen(false);
        toast({
            variant: 'success',
            title: 'Task Added',
            description: `"${newTask.title}" has been added to 'To Do'.`,
        });
    };

    const handleEditTask = (values: any) => {
        if (!editingTask) return;
        const updatedTask = { 
            ...editingTask, 
            ...values,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
        };
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        closeEditDialog();
        toast({
            variant: 'success',
            title: 'Task Updated',
            description: `"${updatedTask.title}" has been updated.`,
        });
    };

    return (
        <main className="flex flex-1 flex-col gap-6 w-full">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Tasks</h1>
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            className="ml-auto gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new task.
                        </DialogDescription>
                        </DialogHeader>
                        <TaskForm onSubmit={handleAddTask} />
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Select value={filters.clientId} onValueChange={(value) => handleFilterChange('clientId', value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Client..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                        <SelectItem value="all">All Clients</SelectItem>
                        {clientsData.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Priority..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
                <Input 
                    type="text" 
                    placeholder="Filter by tag..."
                    value={filters.tag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className="bg-white/5 border-white/10 w-full sm:w-[180px]"
                />
                <Button variant="ghost" onClick={clearFilters} className="rounded-lg text-white/70 hover:text-white hover:bg-white/10">
                    <XIcon className="mr-2 h-4 w-4" /> Clear
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <div className="flex flex-col lg:flex-row gap-6">
                    {columns.map(status => (
                        <TaskColumn
                            key={status}
                            title={columnTitles[status]}
                            status={status}
                            tasks={filteredTasks.filter(t => t.status === status)}
                            onEdit={handleEdit}
                            onDelete={setTaskToDelete}
                        />
                    ))}
                </div>
                 <DragOverlay>
                    {activeTask ? (
                        <div className="w-[300px] md:w-[400px]">
                         <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Edit Task Dialog */}
            <Dialog open={!!editingTask} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Update the details of your task below.
                    </DialogDescription>
                    </DialogHeader>
                    <TaskForm task={editingTask!} onSubmit={handleEditTask} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!taskToDelete} onOpenChange={(isOpen) => !isOpen && setTaskToDelete(null)}>
                <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task "{taskToDelete?.title}".
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="ghost" className="rounded-lg">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Yes, delete task
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}
