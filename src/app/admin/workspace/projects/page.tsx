
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Trash2, Edit, GripVertical, CalendarIcon, DollarSign, User, FileText, X as XIcon, Filter } from 'lucide-react';
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
  DialogFooter,
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
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, differenceInCalendarDays, formatDistanceToNowStrict, isWithinInterval } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const clientsData = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: '2', name: 'Michael Chen', avatar: 'https://picsum.photos/seed/michael/100/100' },
    { id: '3', name: 'Emily Davis', avatar: 'https://picsum.photos/seed/emily/100/100' },
    { id: '4', name: 'David Rodriguez', avatar: 'https://picsum.photos/seed/david/100/100' },
    { id: '5', name: 'Jessica Lee', avatar: 'https://picsum.photos/seed/jessica/100/100' },
];

export type Project = {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  clientId: string;
  budget: number;
  startDate: Date;
  endDate: Date;
};

export type ProjectStatus = 'planning' | 'in-progress' | 'completed';

export const initialProjects: Project[] = [
  { id: 'proj-1', title: 'E-commerce Website', description: 'Full-stack development for online store', status: 'in-progress', clientId: '1', budget: 12000, startDate: new Date(2024, 5, 1), endDate: new Date(2024, 7, 30) },
  { id: 'proj-2', title: 'Mobile App Design', description: 'UI/UX for a new banking app', status: 'planning', clientId: '3', budget: 8000, startDate: new Date(2024, 6, 15), endDate: new Date(2024, 8, 15) },
  { id: 'proj-3', title: 'Corporate Branding', description: 'Complete brand identity refresh', status: 'completed', clientId: '2', budget: 5000, startDate: new Date(2024, 4, 1), endDate: new Date(2024, 5, 15) },
  { id: 'proj-4', title: 'Marketing Campaign', description: 'Digital marketing assets for Q3', status: 'planning', clientId: '5', budget: 7500, startDate: new Date(2024, 7, 1), endDate: new Date(2024, 9, 1) },
  { id: 'proj-5', title: 'Dashboard UI Kit', description: 'Component library for SaaS product', status: 'in-progress', clientId: '4', budget: 15000, startDate: new Date(2024, 5, 20), endDate: new Date(2024, 8, 20) },
  { id: 'proj-6', title: 'AI Chatbot Integration', description: 'Integrate a new AI chatbot into the customer support portal.', status: 'planning', clientId: '1', budget: 9500, startDate: new Date(2024, 8, 1), endDate: new Date(2024, 9, 30) },
  { id: 'proj-7', title: 'Cloud Migration', description: 'Migrate existing infrastructure to a cloud provider.', status: 'in-progress', clientId: '2', budget: 25000, startDate: new Date(2024, 8, 5), endDate: new Date(2024, 11, 20) },
  { id: 'proj-8', title: 'Social Media Analytics Tool', description: 'Develop a tool to track social media engagement.', status: 'planning', clientId: '5', budget: 18000, startDate: new Date(2024, 9, 1), endDate: new Date(2025, 0, 15) },
  { id: 'proj-9', title: 'Website Redesign', description: 'Complete redesign of the main corporate website.', status: 'planning', clientId: '3', budget: 14000, startDate: new Date(2024, 8, 10), endDate: new Date(2024, 11, 1) },
  { id: 'proj-10', title: 'Internal CRM System', description: 'Build a custom CRM for the sales team.', status: 'in-progress', clientId: '4', budget: 30000, startDate: new Date(2024, 9, 15), endDate: new Date(2025, 2, 1) },
  { id: 'proj-11', title: 'Video Streaming Service', description: 'Develop a video streaming platform for web and mobile.', status: 'planning', clientId: '1', budget: 50000, startDate: new Date(2024, 10, 1), endDate: new Date(2025, 4, 1) },
  { id: 'proj-12', title: 'Augmented Reality App', description: 'AR application for furniture visualization.', status: 'planning', clientId: '5', budget: 22000, startDate: new Date(2024, 11, 1), endDate: new Date(2025, 3, 30) },
  { id: 'proj-13', title: 'Blog Platform', description: 'Create a new blog platform with a modern design.', status: 'in-progress', clientId: '2', budget: 6000, startDate: new Date(2024, 8, 20), endDate: new Date(2024, 10, 20) },
  { id: 'proj-14', title: 'API Security Audit', description: 'Conduct a full security audit of all public-facing APIs.', status: 'planning', clientId: '4', budget: 10000, startDate: new Date(2024, 9, 5), endDate: new Date(2024, 9, 25) },
  { id: 'proj-15', title: 'New Feature Prototyping', description: 'Prototype and user-test a new major feature for the main product.', status: 'planning', clientId: '3', budget: 7000, startDate: new Date(2024, 8, 15), endDate: new Date(2024, 9, 15) },
];


const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in-progress':
        return <Badge variant="outline" className="text-orange-400 border-orange-400/40 bg-orange-400/10">In Progress</Badge>;
      case 'planning':
        return <Badge variant="outline" className="text-blue-400 border-blue-400/40 bg-blue-400/10">Planning</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-400 border-green-400/40 bg-green-400/10">Completed</Badge>;
    }
}

const ProjectCard = ({ project, onEdit, onDelete, onView }: { project: Project, onEdit: (project: Project) => void, onDelete: (project: Project) => void, onView: (project: Project) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id, data: {type: 'Project', project} });
    const client = clientsData.find(c => c.id === project.clientId);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    const totalDays = differenceInCalendarDays(project.endDate, project.startDate);
    const daysPassed = differenceInCalendarDays(new Date(), project.startDate);
    const progress = totalDays > 0 ? Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100) : (new Date() > project.endDate ? 100 : 0);

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card className="bg-white/10 backdrop-blur-3xl border-white/20 shadow-lg rounded-xl mb-4 transition-shadow hover:shadow-2xl cursor-pointer" onClick={() => onView(project)}>
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                         <div {...listeners} onClick={e => e.stopPropagation()} className="flex-shrink-0 pt-1 text-white/40 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base font-semibold text-white/95 flex-1 ml-2">{project.title}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" className="h-6 w-6 text-white/70 hover:bg-white/20 hover:text-white" onClick={e => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onEdit(project); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white" onSelect={(e) => { e.stopPropagation(); onDelete(project); }}>
                                  <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <p className="text-sm text-white/60 mb-4">{project.description}</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm text-white/80">
                           {client && (
                                <div className="flex items-center gap-2">
                                     <Avatar className="h-6 w-6">
                                        <AvatarImage src={client.avatar} alt={client.name} />
                                        <AvatarFallback>{client.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{client.name}</span>
                                </div>
                            )}
                             <div className="flex items-center gap-1.5 font-semibold text-green-400">
                                <DollarSign className="h-4 w-4"/>
                                <span>{project.budget.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs text-white/50">
                                <span>{format(project.startDate, 'MMM d, yyyy')}</span>
                                <span>{format(project.endDate, 'MMM d, yyyy')}</span>
                            </div>
                             <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ProjectColumn = ({ title, status, projects, onEdit, onDelete, onView }: { title: string, status: ProjectStatus, projects: Project[], onEdit: (project: Project) => void, onDelete: (project: Project) => void, onView: (project: Project) => void }) => {
    const { setNodeRef, isOver } = useSortable({ id: status, data: { type: 'Column', status }});
    const projectsById = React.useMemo(() => projects.map(p => p.id), [projects]);

    return (
        <div ref={setNodeRef} className={cn("flex-1", isOver ? "ring-2 ring-primary ring-offset-2 ring-offset-background/50 rounded-2xl" : "")}>
            <h3 className="text-lg font-semibold text-white/90 mb-4 px-1">{title} <Badge variant="outline" className="ml-2 bg-white/10 border-white/20 text-white/70">{projects.length}</Badge></h3>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2 sm:p-4 min-h-[600px]">
                <SortableContext items={projectsById} strategy={verticalListSortingStrategy}>
                    {projects.map(project => <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} onView={onView} />)}
                </SortableContext>
            </div>
        </div>
    );
};

const ProjectForm = ({ project, onSubmit, onCancel }: { project?: Project, onSubmit: (values: any) => void, onCancel: () => void }) => {
    const [startDate, setStartDate] = React.useState<Date | undefined>(project?.startDate);
    const [endDate, setEndDate] = React.useState<Date | undefined>(project?.endDate);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        onSubmit({ ...values, startDate, endDate, budget: Number(values.budget) });
    };
    
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" defaultValue={project?.title} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" name="description" defaultValue={project?.description} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">Client</Label>
               <Select name="clientId" defaultValue={project?.clientId} required>
                <SelectTrigger id="clientId" className="col-span-3 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    {clientsData.map(client => <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">Budget</Label>
              <Input id="budget" name="budget" type="number" defaultValue={project?.budget} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Timeline</Label>
                <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10", !startDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "MMM d, yyyy") : <span>Start Date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-xl border-white/10 text-white" align="start">
                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10", !endDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "MMM d, yyyy") : <span>End Date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-xl border-white/10 text-white" align="start">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg">Cancel</Button>
                <Button type="submit" className="rounded-lg">Save Project</Button>
            </div>
        </form>
    );
};

const ProjectViewDialog = ({ project, open, onOpenChange }: { project: Project | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!project) return null;
    
    const client = clientsData.find(c => c.id === project.clientId);
    const totalDays = differenceInCalendarDays(project.endDate, project.startDate);
    const daysPassed = differenceInCalendarDays(new Date(), project.startDate);
    const progress = totalDays > 0 ? Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100) : (new Date() > project.endDate ? 100 : 0);
    const timeRemaining = formatDistanceToNowStrict(project.endDate, { addSuffix: true });

    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg p-0 rounded-2xl">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl">{project.title}</DialogTitle>
                        {getStatusBadge(project.status)}
                    </div>
                    {client && (
                        <div className="flex items-center gap-2 pt-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={client.avatar} alt={client.name} />
                                <AvatarFallback>{client.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white/70">{client.name}</span>
                        </div>
                    )}
                </DialogHeader>
                <div className="space-y-6 px-6 pb-6">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Description</h4>
                        <p className="text-white/70 text-sm">{project.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4"/> Budget</h4>
                            <p className="text-2xl font-bold text-green-400">{project.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        </div>
                         <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h4 className="font-semibold text-white/80 mb-2 flex items-center gap-2"><CalendarIcon className="h-4 w-4"/> Timeline</h4>
                             <p className="text-sm text-white/70">{format(project.startDate, "MMM d")} - {format(project.endDate, "MMM d, yyyy")}</p>
                             <p className="text-xs text-white/50">{timeRemaining}</p>
                        </div>
                    </div>

                    <div>
                        <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
                        <p className="text-xs text-white/50 text-right mt-1.5">{Math.round(progress)}% Complete</p>
                    </div>
                </div>
                 <DialogFooter className="p-6 pt-0 mt-2">
                    <Button onClick={() => onOpenChange(false)} className="rounded-lg w-full bg-white/10 hover:bg-white/20 text-white">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ProjectsPage() {
    const [projects, setProjects] = React.useState<Project[]>(initialProjects);
    const [activeProject, setActiveProject] = React.useState<Project | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [editingProject, setEditingProject] = React.useState<Project | null>(null);
    const [viewingProject, setViewingProject] = React.useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
    const { toast } = useToast();
    const sensors = useSensors(useSensor(PointerSensor));

    const [filters, setFilters] = React.useState<{
        clientId: string;
        status: 'all' | ProjectStatus;
        budgetMin: number | '';
        budgetMax: number | '';
    }>({
        clientId: 'all',
        status: 'all',
        budgetMin: '',
        budgetMax: '',
    });

    const columns: ProjectStatus[] = ['planning', 'in-progress', 'completed'];
    const columnTitles = { planning: 'Planning', 'in-progress': 'In Progress', completed: 'Completed' };
    
    const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const clearFilters = () => {
        setFilters({
            clientId: 'all',
            status: 'all',
            budgetMin: '',
            budgetMax: '',
        });
    };

    const filteredProjects = React.useMemo(() => {
        return projects.filter(project => {
            const clientMatch = filters.clientId === 'all' || project.clientId === filters.clientId;
            const statusMatch = filters.status === 'all' || project.status === filters.status;
            
            const budgetMinMatch = filters.budgetMin === '' || project.budget >= filters.budgetMin;
            const budgetMaxMatch = filters.budgetMax === '' || project.budget <= filters.budgetMax;
            
            return clientMatch && statusMatch && budgetMinMatch && budgetMaxMatch;
        });
    }, [projects, filters]);


    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Project') {
            setActiveProject(active.data.current.project);
        }
    }, []);

    const handleDragOver = React.useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAProject = active.data.current?.type === "Project";
        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveAProject && isOverAColumn) {
            setProjects(currentProjects => {
                const activeIndex = currentProjects.findIndex(p => p.id === activeId);
                const currentStatus = currentProjects[activeIndex].status;
                const newStatus = over.data.current?.status as ProjectStatus;
                if (currentStatus === newStatus) return currentProjects;

                const updatedProject = { ...currentProjects[activeIndex], status: newStatus };
                const newProjects = [...currentProjects];
                newProjects[activeIndex] = updatedProject;

                return arrayMove(newProjects, activeIndex, activeIndex); // Keep position but update status
            });
        }
        
        const isOverAProject = over.data.current?.type === "Project";
        if (isActiveAProject && isOverAProject) {
             setProjects(currentProjects => {
                const activeIndex = currentProjects.findIndex(p => p.id === activeId);
                const overIndex = currentProjects.findIndex(p => p.id === overId);
                
                if (currentProjects[activeIndex].status !== currentProjects[overIndex].status) {
                    currentProjects[activeIndex].status = currentProjects[overIndex].status;
                    return arrayMove(currentProjects, activeIndex, overIndex);
                }

                return arrayMove(currentProjects, activeIndex, overIndex);
            });
        }
    }, []);

    const handleDragEnd = React.useCallback(() => {
        setActiveProject(null);
    }, []);

    const handleEdit = (project: Project) => setEditingProject(project);
    const closeEditDialog = () => setEditingProject(null);
    const handleView = (project: Project) => setViewingProject(project);

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            setProjectToDelete(null);
            toast({
                variant: 'success',
                title: 'Project Removed',
                description: `"${projectToDelete.title}" has been removed.`,
            });
        }
    };

    const handleAddProject = (values: any) => {
        const newProject: Project = {
            id: `project-${Date.now()}`,
            status: 'planning',
            ...values
        };
        setProjects([...projects, newProject]);
        setIsAddDialogOpen(false);
        toast({
            variant: 'success',
            title: 'Project Added',
            description: `"${newProject.title}" has been added to 'Planning'.`,
        });
    };

    const handleEditProject = (values: any) => {
        if (!editingProject) return;
        const updatedProject = { ...editingProject, ...values };
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        closeEditDialog();
        toast({
            variant: 'success',
            title: 'Project Updated',
            description: `"${updatedProject.title}" has been updated.`,
        });
    };

    const hasActiveFilters = filters.clientId !== 'all' || filters.status !== 'all' || filters.budgetMin !== '' || filters.budgetMax !== '';

    return (
        <main className="flex flex-col h-full pt-4">
             <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-white flex-shrink-0">Projects</h1>
                    
                    <div className="ml-auto flex items-center gap-2">
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
                                        <p className="text-sm text-white/60">
                                        Adjust the filters to refine the project list.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
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
                                         <div className="grid grid-cols-3 items-center gap-4">
                                            <Label>Status</Label>
                                            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                                <SelectTrigger className="bg-white/5 border-white/10 col-span-2">
                                                    <SelectValue placeholder="Status..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                                                    <SelectItem value="all">All Statuses</SelectItem>
                                                    <SelectItem value="planning">Planning</SelectItem>
                                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="grid grid-cols-3 items-center gap-4">
                                            <Label>Budget</Label>
                                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                                <Input 
                                                    type="number" 
                                                    placeholder="Min"
                                                    value={filters.budgetMin}
                                                    onChange={(e) => handleFilterChange('budgetMin', e.target.value === '' ? '' : Number(e.target.value))}
                                                    className="bg-white/5 border-white/10"
                                                />
                                                <Input 
                                                    type="number" 
                                                    placeholder="Max"
                                                    value={filters.budgetMax}
                                                    onChange={(e) => handleFilterChange('budgetMax', e.target.value === '' ? '' : Number(e.target.value))}
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {hasActiveFilters && (
                                        <Button variant="ghost" onClick={clearFilters} className="rounded-lg text-white/70 hover:text-white hover:bg-white/10 w-full justify-center">
                                            <XIcon className="mr-2 h-4 w-4" /> Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                    <PlusCircle className="h-4 w-4" />
                                    Add Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Add New Project</DialogTitle>
                                    <DialogDescription>Enter the details for the new project.</DialogDescription>
                                </DialogHeader>
                                <ProjectForm onSubmit={handleAddProject} onCancel={() => setIsAddDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                      {columns.map(status => (
                          <ProjectColumn
                              key={status}
                              title={columnTitles[status]}
                              status={status}
                              projects={filteredProjects.filter(p => p.status === status)}
                              onEdit={handleEdit}
                              onDelete={setProjectToDelete}
                              onView={handleView}
                          />
                      ))}
                  </div>
                  <DragOverlay>
                      {activeProject ? (
                          <div className="w-[300px] md:w-[400px]">
                              <ProjectCard project={activeProject} onEdit={() => {}} onDelete={() => {}} onView={() => {}} />
                          </div>
                      ) : null}
                  </DragOverlay>
              </DndContext>
            </div>

            {/* Edit Project Dialog */}
            <Dialog open={!!editingProject} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update the details of your project.</DialogDescription>
                    </DialogHeader>
                    <ProjectForm project={editingProject!} onSubmit={handleEditProject} onCancel={closeEditDialog} />
                </DialogContent>
            </Dialog>

             {/* View Project Dialog */}
             <ProjectViewDialog 
                project={viewingProject} 
                open={!!viewingProject} 
                onOpenChange={(isOpen) => !isOpen && setViewingProject(null)} 
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!projectToDelete} onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}>
                <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project "{projectToDelete?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="ghost" className="rounded-lg">Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Yes, delete project
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}

// Custom Progress component to allow indicator class name
const ProgressWithIndicator = ({ indicatorClassName, ...props }: React.ComponentProps<typeof Progress> & { indicatorClassName?: string }) => {
    return (
      <Progress {...props} >
         {/* @ts-ignore */}
        <Progress.Indicator className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)} style={{ transform: `translateX(-${100 - (props.value || 0)}%)` }} />
      </Progress>
    )
  }

  // Adding the custom indicator class to the ui/progress component is tricky without modifying the base component.
  // For this implementation, I've just added a prop to the project card that uses a normal Progress bar and styles it.
  
  const originalProgress = Progress;
  // @ts-ignore
  originalProgress.Indicator = Progress.Indicator;

    

    

    


    



    