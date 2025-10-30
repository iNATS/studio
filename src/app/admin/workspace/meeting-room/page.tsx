
'use client';

import * as React from 'react';
import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Send,
  Trash2,
  Users,
  Search,
  Mail,
  Folder,
  Star,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Paperclip,
  Smile,
  Edit
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

const emails = [
  {
    id: '1',
    name: 'Sarah Johnson',
    subject: 'Re: Project Update & Next Steps',
    text: "Thanks for the update! The latest designs look fantastic. I've left a few comments on the Figma file. Let's schedule a quick call for tomorrow to sync up. Best, Sarah",
    date: new Date(new Date().setDate(new Date().getDate() - 0)),
    read: false,
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: '2',
    name: 'Michael Chen',
    subject: 'Question about the mobile app prototype',
    text: "Hey, had a quick question about the user flow for the funds transfer feature. Is it possible to add a confirmation step before the final submission? Let me know your thoughts. Thanks, Michael",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    read: false,
    avatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: '3',
    name: 'Emily Davis',
    subject: 'Inquiry: Full Branding Package',
    text: "Hi there, I found your portfolio and was very impressed. We're a new creative studio looking for a complete branding package. I'd love to learn more about your process and availability. Looking forward to hearing from you. Emily",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    read: true,
    avatar: 'https://picsum.photos/seed/emily/100/100',
  },
  {
    id: '4',
    name: 'Jessica Lee',
    subject: 'Monthly Analytics Report for E-commerce Co.',
    text: "Hi, just a reminder that the monthly analytics report is due at the end of the week. Please let me know if you need anything from my end. Thanks! Jessica",
    date: new Date(new Date().setDate(new Date().getDate() - 4)),
    read: true,
    avatar: 'https://picsum.photos/seed/jessica/100/100',
  },
  {
    id: '5',
    name: 'Chris Brown',
    subject: 'Follow-up on Data Systems project',
    text: "Hello, following up on our conversation from last week. We're ready to move forward with the project. I've attached the signed proposal. Let me know what the next steps are. Regards, Chris",
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    read: true,
    avatar: 'https://picsum.photos/seed/chris/100/100',
  },
];

type Email = (typeof emails)[number];

export default function CommunicationsPage() {
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(emails[0]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 pt-4 pb-4 -mx-4 -mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 -mx-4 px-4 pb-4 overflow-hidden h-[calc(100%-80px)]">
        
        {/* Sidebar */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col p-2">
            <div className="p-2">
                 <Button className="w-full rounded-lg gap-2">
                    <Edit className="h-4 w-4" /> Compose
                </Button>
            </div>
            <nav className="flex-1 space-y-1 p-2">
                <a href="#" className="flex items-center gap-3 rounded-lg bg-black/10 dark:bg-white/20 px-3 py-2 text-primary-foreground font-semibold">
                    <Inbox className="h-4 w-4" />
                    Inbox
                    <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-primary/80 text-primary-foreground text-xs">
                        {emails.filter(e => !e.read).length}
                    </span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Star className="h-4 w-4" />
                    Starred
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Send className="h-4 w-4" />
                    Sent
                </a>
                 <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Clock className="h-4 w-4" />
                    Snoozed
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Archive className="h-4 w-4" />
                    Archive
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Trash2 className="h-4 w-4" />
                    Trash
                </a>
            </nav>
        </div>

        {/* Email List */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col">
            <div className="p-4 border-b border-zinc-200/80 dark:border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-white/50" />
                    <Input placeholder="Search mail..." className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 pl-10 rounded-lg" />
                </div>
            </div>
            <ScrollArea>
              <div className="flex flex-col gap-2 p-4 pt-0">
                {emails.map((email) => (
                  <button
                    key={email.id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5",
                      selectedEmail?.id === email.id && "bg-black/10 dark:bg-white/10 border-zinc-300 dark:border-white/20"
                    )}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex w-full items-center">
                      <div className="flex items-center gap-3">
                        {!email.read && <span className="flex h-2 w-2 rounded-full bg-blue-500" />}
                        <div className="font-semibold">{email.name}</div>
                      </div>
                      <div className={cn("ml-auto text-xs", selectedEmail?.id === email.id ? "text-foreground" : "text-muted-foreground")}>
                        {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="text-xs font-medium">{email.subject}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {email.text.substring(0, 300)}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
        </div>

        {/* Mail Display */}
        {selectedEmail && (
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col">
                <div className="flex items-center p-4 border-b border-zinc-200/80 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-zinc-200 dark:border-white/20">
                            <AvatarImage src={selectedEmail.avatar} alt={selectedEmail.name} />
                            <AvatarFallback>{selectedEmail.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{selectedEmail.name}</p>
                            <p className="text-sm text-muted-foreground">{`to me <mohamed.aref@example.com>`}</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{format(selectedEmail.date, 'PPpp')}</span>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                            <DropdownMenuItem><Reply className="mr-2 h-4 w-4" />Reply</DropdownMenuItem>
                            <DropdownMenuItem><ReplyAll className="mr-2 h-4 w-4" />Reply All</DropdownMenuItem>
                            <DropdownMenuItem><Forward className="mr-2 h-4 w-4" />Forward</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-white"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">{selectedEmail.subject}</h2>
                        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                           {selectedEmail.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-zinc-200/80 dark:border-white/10">
                    <Textarea placeholder="Click here to reply..." className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><Smile className="h-4 w-4" /></Button>
                        </div>
                        <Button className="rounded-lg gap-2">Send <Send className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
