
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
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { portfolioItems, PortfolioItem } from '@/components/landing/Portfolio';
import Image from 'next/image';
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
import { ProjectWizard } from '@/components/admin/ProjectWizard';
import { useToast } from '@/hooks/use-toast';

export default function AdminProjectsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<PortfolioItem | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  const handleEdit = (project: PortfolioItem) => {
    setEditingProject(project);
  };

  const closeEditDialog = () => {
    setEditingProject(null);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      console.log('Deleting project:', projectToDelete.title);
      // Here you would add the actual logic to delete the project
      setProjectToDelete(null); // Close the dialog
      toast({
        variant: 'success',
        title: "Work Deleted",
        description: `"${projectToDelete.title}" has been removed.`,
      });
    }
  };
  
  const getProjectForForm = (project: PortfolioItem | null) => {
    if (!project) return undefined;
    
    return {
      ...project,
      tags: project.tags.join(', '),
      image: undefined,
      screenshots: undefined,
    }
  }

  return (
    <main className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Works</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="ml-auto gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              <PlusCircle className="h-4 w-4" />
              Add Work
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Work</DialogTitle>
              <DialogDescription>
                Follow the steps to add a new work to your portfolio.
              </DialogDescription>
            </DialogHeader>
             <ProjectWizard
              onSubmit={(values) => {
                  console.log('Adding work:', values);
                  setIsAddDialogOpen(false);
                  toast({
                    variant: 'success',
                    title: "Work Published!",
                    description: "Your new work has been added to the portfolio.",
                  });
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog open={!!editingProject} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
           <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Work</DialogTitle>
              <DialogDescription>
                 Update the details of your work below.
              </DialogDescription>
            </DialogHeader>
            <ProjectWizard
              project={getProjectForForm(editingProject)}
              onSubmit={(values) => {
                console.log('Editing work:', values);
                closeEditDialog();
                toast({
                  variant: 'success',
                  title: "Work Updated!",
                  description: "Your work has been successfully updated.",
                });
              }}
            />
          </DialogContent>
        </Dialog>

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={!!projectToDelete} onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}>
          <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                work "{projectToDelete?.title}" from your portfolio.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost" className="rounded-lg">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, delete it
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col min-h-0">
        <CardHeader>
          <CardTitle className="text-white/90">Manage Your Portfolio</CardTitle>
          <CardDescription className="text-white/60">
            View, edit, or delete your works.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
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
                        <DropdownMenuItem onSelect={() => handleEdit(project)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => window.open(`/projects/${project.slug}`, '_blank')}>View</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white" onSelect={() => setProjectToDelete(project)}>
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
