
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { Pagination } from '@/components/ui/pagination';
import { useDatabase } from '@/firebase';
import { ref, push, remove, update, child, set } from 'firebase/database';
import type { PortfolioItem } from '@/components/landing/Portfolio';
import { Skeleton } from '@/components/ui/skeleton';
import { uploadFile } from '@/firebase/storage';
import { useRTDBList } from '@/firebase/non-blocking-updates';
import { placeholderProjects } from '@/lib/placeholder-data';
import { useFirebase } from '@/firebase';

export default function AdminProjectsPage() {
  const { storage } = useFirebase();
  const database = useDatabase();

  const portfolioItemsRef = React.useMemo(() => {
    return database ? ref(database, 'portfolioItems') : null;
  }, [database]);

  const { data: portfolioItems, loading } = useRTDBList<PortfolioItem>(portfolioItemsRef);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<PortfolioItem | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Seed data if database is empty
  React.useEffect(() => {
    if (!loading && portfolioItems.length === 0 && database) {
        const portfolioRef = ref(database, 'portfolioItems');
        const updates: { [key: string]: Omit<PortfolioItem, 'id'> } = {};
        placeholderProjects.forEach(project => {
            const newKey = push(child(ref(database), 'portfolioItems')).key;
            if(newKey) {
                updates[newKey] = project;
            }
        });

        set(portfolioRef, updates).then(() => {
            toast({
                title: "Portfolio Seeded!",
                description: "10 sample projects have been added to your portfolio.",
            });
        }).catch(error => {
            console.error("Error seeding data: ", error);
            toast({
                variant: 'destructive',
                title: "Seeding Failed",
                description: "Could not add sample projects to the database.",
            });
        });
    }
  }, [loading, portfolioItems, database, toast]);
  
  const paginatedItems = React.useMemo(() => {
    if (!portfolioItems) return [];
    const sortedItems = [...portfolioItems].sort((a, b) => (a.title > b.title ? 1 : -1));
    return sortedItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [portfolioItems, currentPage]);

  const totalPages = React.useMemo(() => {
    if (!portfolioItems) return 1;
    return Math.ceil(portfolioItems.length / itemsPerPage);
  }, [portfolioItems]);


  const handleAddWork = async (values: any) => {
    if (!database || !storage) {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Database connection not available.",
        });
        return;
    }

    const { tags, imageFile, screenshotFiles, ...rest } = values;
    
    try {
        let imageUrl = '';
        if (imageFile) {
            const imagePath = `portfolio/${Date.now()}_${imageFile.name}`;
            imageUrl = await uploadFile(storage, imagePath, imageFile);
        }

        let screenshotUrls: string[] = [];
        if (screenshotFiles && screenshotFiles.length > 0) {
            screenshotUrls = await Promise.all(
                Array.from(screenshotFiles as FileList).map(async (file) => {
                    const screenshotPath = `portfolio/screenshots/${Date.now()}_${file.name}`;
                    return await uploadFile(storage, screenshotPath, file);
                })
            );
        }

        const newWork: Omit<PortfolioItem, 'id'> = {
          ...rest,
          tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
          image: imageUrl,
          screenshots: screenshotUrls,
          hint: '', 
        };
        
        console.log("Data being sent to Firebase:", newWork);
        const newWorkRef = push(ref(database, 'portfolioItems'));
        await set(newWorkRef, newWork);

        setIsAddDialogOpen(false);
        toast({
          title: "Work Published!",
          description: "Your new work has been added to the portfolio.",
        });
    } catch(e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: "Upload Failed",
            description: "There was an error saving your project. Please try again.",
        });
    }
  }

  const handleEditWork = async (values: any) => {
    if (!editingProject?.id || !database || !storage) return;

    const { tags, imageFile, screenshotFiles, ...rest } = values;
    
    try {
        const updatedWork: Partial<PortfolioItem> = {
            ...rest,
            tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
        };

        if (imageFile) {
            const imagePath = `portfolio/${Date.now()}_${imageFile.name}`;
            updatedWork.image = await uploadFile(storage, imagePath, imageFile);
        }

        if (screenshotFiles && screenshotFiles.length > 0) {
            const newScreenshots = await Promise.all(
                Array.from(screenshotFiles as FileList).map(async (file) => {
                    const screenshotPath = `portfolio/screenshots/${Date.now()}_${file.name}`;
                    return await uploadFile(storage, screenshotPath, file);
                })
            );
            updatedWork.screenshots = [...(editingProject.screenshots || []), ...newScreenshots];
        }
        
        const workRef = ref(database, `portfolioItems/${editingProject.id}`);
        await update(workRef, updatedWork);

        setEditingProject(null);
        toast({
          title: "Work Updated!",
          description: "Your work has been successfully updated.",
        });
    } catch (e) {
        console.error(e);
        toast({
            variant: 'destructive',
            title: "Update Failed",
            description: "There was an error updating your project. Please try again.",
        });
    }
  }

  const handleEdit = (project: PortfolioItem) => {
    setEditingProject(project);
  };

  const closeEditDialog = () => {
    setEditingProject(null);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete?.id && database) {
        const workRef = child(ref(database, 'portfolioItems'), projectToDelete.id);
        await remove(workRef);
        setProjectToDelete(null);
        toast({
            title: 'Work Deleted',
            description: `"${projectToDelete.title}" has been removed.`,
        });
    }
  };
  
  const getProjectForForm = (project: PortfolioItem | null) => {
    if (!project) return undefined;
    
    return {
      ...project,
      tags: project.tags?.join(', ') || '',
      link: project.link || '',
      image: project.image || '',
      imageFile: undefined,
      screenshotFiles: undefined,
    }
  }

  return (
    <main className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold">My Works</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button
                size="sm"
                className="ml-auto gap-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground dark:text-white rounded-lg"
                >
                <PlusCircle className="h-4 w-4" />
                Add Work
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-2xl">
                <DialogHeader>
                <DialogTitle>Add New Work</DialogTitle>
                <DialogDescription className="text-zinc-600 dark:text-white/60">
                    Follow the steps to add a new work to your portfolio.
                </DialogDescription>
                </DialogHeader>
                <ProjectWizard
                  onSubmit={handleAddWork}
                />
            </DialogContent>
            </Dialog>
        </div>
      </div>

        {/* Edit Project Dialog */}
        <Dialog open={!!editingProject} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
           <DialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Work</DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-white/60">
                 Update the details of your work below.
              </DialogDescription>
            </DialogHeader>
            <ProjectWizard
              project={getProjectForForm(editingProject)}
              onSubmit={handleEditWork}
            />
          </DialogContent>
        </Dialog>

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={!!projectToDelete} onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}>
          <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
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
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-8">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex-1 flex flex-col min-h-0">
                <CardHeader>
                <CardTitle>Manage Your Portfolio</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">
                    View, edit, or delete your works.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
                    <TableRow className="border-zinc-200/80 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">
                        <TableHead className="hidden w-[100px] sm:table-cell text-zinc-700 dark:text-white/80">
                        <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead className="text-zinc-700 dark:text-white/80">Title</TableHead>
                        <TableHead className="text-zinc-700 dark:text-white/80">Category</TableHead>
                        <TableHead className="hidden md:table-cell text-zinc-700 dark:text-white/80">
                        Tags
                        </TableHead>
                        <TableHead className="sticky top-0 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell className="hidden sm:table-cell">
                             <Skeleton className="h-16 w-16 rounded-md" />
                          </TableCell>
                           <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                           <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                           <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-60" /></TableCell>
                           <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                    paginatedItems.map((project) => (
                        <TableRow
                        key={project.id}
                        className="border-zinc-200/80 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                        <TableCell className="hidden sm:table-cell">
                            {project.image && (
                              <Image
                                alt={project.title}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={project.image}
                                width="64"
                              />
                            )}
                        </TableCell>
                        <TableCell className="font-medium">
                            {project.title}
                        </TableCell>
                        <TableCell>
                            <Badge
                            variant="outline"
                            className="text-zinc-600 dark:text-white/70 border-zinc-300 dark:border-white/20"
                            >
                            {project.category}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                            {(project.tags || []).slice(0, 3).map((tag) => (
                                <Badge
                                key={tag}
                                variant="outline"
                                className="text-zinc-500 dark:text-white/60 border-zinc-200/80 dark:border-white/10 text-xs"
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
                                className="h-8 w-8 text-zinc-600 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white"
                                >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white"
                            >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleEdit(project)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => window.open(`/projects/${project.slug}`, '_blank')}>View</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:bg-red-400/20 focus:text-red-500 dark:focus:text-white" onSelect={() => setProjectToDelete(project)}>
                                Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    )))}
                    </TableBody>
                </Table>
                </CardContent>
                <CardFooter className="border-t border-zinc-200/80 dark:border-white/10 px-6 py-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </CardFooter>
            </Card>
        </div>
    </main>
  );

    