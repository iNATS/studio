'use client';

import * as React from 'react';
import Image from 'next/image';
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
import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Client = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'archived' | 'new';
  company: string;
};

const clientsData: Client[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@innovate.inc', avatar: 'https://picsum.photos/seed/sarah/100/100', status: 'active', company: 'Innovate Inc.' },
    { id: '2', name: 'Michael Chen', email: 'michael.c@techsolutions.com', avatar: 'https://picsum.photos/seed/michael/100/100', status: 'active', company: 'Tech Solutions' },
    { id: '3', name: 'Emily Davis', email: 'emily.d@creativestudio.com', avatar: 'https://picsum.photos/seed/emily/100/100', status: 'new', company: 'Creative Studio' },
    { id: '4', name: 'David Rodriguez', email: 'david.r@startuphub.io', avatar: 'https://picsum.photos/seed/david/100/100', status: 'archived', company: 'Startup Hub' },
    { id: '5', name: 'Jessica Lee', email: 'jessica.l@ecommerce.co', avatar: 'https://picsum.photos/seed/jessica/100/100', status: 'active', company: 'E-commerce Co.' },
];


const ClientForm = ({ client, onSubmit, onCancel }: { client?: Client, onSubmit: (values: any) => void, onCancel: () => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries());
        onSubmit(values);
    }
    
    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" defaultValue={client?.name} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input id="company" name="company" defaultValue={client?.company} className="col-span-3 bg-white/5 border-white/10" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
               <Select name="status" defaultValue={client?.status}>
                <SelectTrigger id="status" className="col-span-3 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-lg">Cancel</Button>
                <Button type="submit" className="rounded-lg">Save changes</Button>
            </div>
          </form>
    )
}

const getStatusBadge = (status: Client['status']) => {
    switch (status) {
        case 'active':
            return <Badge variant="outline" className="text-green-400 border-green-400/40 bg-green-400/10">Active</Badge>;
        case 'new':
            return <Badge variant="outline" className="text-blue-400 border-blue-400/40 bg-blue-400/10">New</Badge>;
        case 'archived':
            return <Badge variant="outline" className="text-white/50 border-white/20 bg-white/10">Archived</Badge>;
    }
}

export default function ClientsPage() {
  const [clients, setClients] = React.useState(clientsData);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);
  const { toast } = useToast();

  const handleEdit = (client: Client) => {
    setEditingClient(client);
  };
  
  const handleView = (client: Client) => {
    // Placeholder for view functionality
    toast({
        title: 'View Client',
        description: `Viewing details for "${client.name}".`,
    });
  };

  const closeEditDialog = () => {
    setEditingClient(null);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null); // Close the dialog
      toast({
        variant: 'success',
        title: 'Client Removed',
        description: `"${clientToDelete.name}" has been removed.`,
      });
    }
  };

  const handleAddClient = (values: any) => {
    const newClient = {
        ...values,
        id: (clients.length + 1).toString(),
        avatar: `https://picsum.photos/seed/${values.name}/100/100`,
    } as Client;
    setClients([...clients, newClient]);
    setIsAddDialogOpen(false);
    toast({
        variant: 'success',
        title: 'Client Added',
        description: `"${newClient.name}" has been added.`,
      });
  }

  const handleEditClient = (values: any) => {
    if(!editingClient) return;

    const updatedClient = { ...editingClient, ...values };
    setClients(clients.map(c => c.id === editingClient.id ? updatedClient : c));
    closeEditDialog();
    toast({
        variant: 'success',
        title: 'Client Updated',
        description: `"${updatedClient.name}" has been updated.`,
      });
  }
  
  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="ml-auto gap-1 bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              <PlusCircle className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details for the new client.
              </DialogDescription>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={!!editingClient} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
           <DialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                 Update the details of your client below.
              </DialogDescription>
            </DialogHeader>
            <ClientForm client={editingClient!} onSubmit={handleEditClient} onCancel={closeEditDialog} />
          </DialogContent>
        </Dialog>

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={!!clientToDelete} onOpenChange={(isOpen) => !isOpen && setClientToDelete(null)}>
          <AlertDialogContent className="bg-background/80 backdrop-blur-xl border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the client "{clientToDelete?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost" className="rounded-lg">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                <Trash2 className="mr-2 h-4 w-4" />
                Yes, delete client
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
                <CardTitle className="text-white/90">Your Clients</CardTitle>
                <CardDescription className="text-white/60">
                    Manage your client relationships.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/10">
                        <TableHead className="text-white/80">Client</TableHead>
                        <TableHead className="text-white/80 hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-white/80 hidden lg:table-cell">Company</TableHead>
                        <TableHead className="text-white/80">Status</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {clients.map((client) => (
                        <TableRow
                        key={client.id}
                        className="border-white/10 hover:bg-white/5"
                        >
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="hidden h-9 w-9 sm:flex border-2 border-white/20">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium text-white/90">{client.name}</div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-white/70">{client.email}</TableCell>
                        <TableCell className="hidden lg:table-cell text-white/70">{client.company}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white rounded-full"
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
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); handleView(client); }}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); handleEdit(client); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 focus:bg-red-400/20 focus:text-white" onSelect={(e) => { e.stopPropagation(); setClientToDelete(client); }}>
                                <Trash2 className="mr-2 h-4 w-4" />Delete
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

    