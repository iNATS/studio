'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { portfolioItems } from '@/components/landing/Portfolio';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminProjectsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="ml-auto gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              <PlusCircle className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-3xl flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Fill out the details below to add a new project to your
                portfolio.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow min-h-0">
                <div className="pr-6">
                    <ProjectForm
                    onSubmit={(values) => {
                        console.log(values);
                        setIsAddDialogOpen(false);
                    }}
                    />
                </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white/90">Manage Your Portfolio</CardTitle>
          <CardDescription className="text-white/60">
            View, edit, or delete your projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/10">
                <TableHead className="hidden w-[100px] sm:table-cell text-white/80">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead className="text-white/80">Title</TableHead>
                <TableHead className="text-white/80">Category</TableHead>
                <TableHead className="hidden md:table-cell text-white/80">
                  Tags
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioItems.map((project) => (
                <TableRow
                  key={project.slug}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={project.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={project.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white/90">
                    {project.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-white/70 border-white/20"
                    >
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-white/60 border-white/10 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
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
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
