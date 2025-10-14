
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
};

const tasksData: Task[] = [
  { id: '1', title: 'Design Landing Page', description: 'Create mockups in Figma', status: 'in-progress', priority: 'high' },
  { id: '2', title: 'Develop API Endpoints', description: 'Setup new routes for user auth', status: 'todo', priority: 'high' },
  { id: '3', title: 'Fix Login Bug', description: 'Users reporting issues on mobile', status: 'in-progress', priority: 'medium' },
  { id: '4', title: 'Write Documentation', description: 'For the new credit card processing feature', status: 'todo', priority: 'low' },
  { id: '5', title: 'Deploy Staging Server', description: 'Update server with latest build', status: 'done', priority: 'high' },
  { id: '6', title: 'Client Meeting Prep', description: 'Prepare slides for project update', status: 'done', priority: 'medium' },
  { id: '7', title: 'Update Dependencies', description: 'Check for security vulnerabilities', status: 'todo', priority: 'low' },
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

const TaskCard = ({ task }: { task: Task }) => (
    <Card className="bg-white/10 backdrop-blur-3xl border-white/20 shadow-lg rounded-xl mb-4">
        <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-white/90">{task.title}</h4>
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className="text-sm text-white/60 mt-1 mb-3">{task.description}</p>
            {getPriorityBadge(task.priority)}
        </CardContent>
    </Card>
);

const TaskColumn = ({ title, tasks }: { title: string, tasks: Task[] }) => (
    <div className="flex-1">
        <h3 className="text-lg font-semibold text-white/90 mb-4 px-1">{title}</h3>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[500px]">
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
    </div>
);


export default function TasksPage() {
    const todoTasks = tasksData.filter(t => t.status === 'todo');
    const inProgressTasks = tasksData.filter(t => t.status === 'in-progress');
    const doneTasks = tasksData.filter(t => t.status === 'done');

  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
         <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Tasks</h1>
            <Button
                size="sm"
                className="ml-auto gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                <PlusCircle className="h-4 w-4" />
                Add Task
            </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
            <TaskColumn title="To Do" tasks={todoTasks} />
            <TaskColumn title="In Progress" tasks={inProgressTasks} />
            <TaskColumn title="Done" tasks={doneTasks} />
        </div>
    </main>
  );
}
