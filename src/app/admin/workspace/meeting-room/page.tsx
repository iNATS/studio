
'use client';

import * as React from 'react';
import {
  Archive,
  File,
  Inbox,
  Send,
  Trash2,
  Search,
  Mail,
  Star,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
  Paperclip,
  Smile,
  Edit,
  Calendar,
  Video,
  Users,
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
import { emails, meetings, contacts } from './data';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


type MailboxItem = (typeof emails)[number];
type Meeting = (typeof meetings)[number];
type Contact = (typeof contacts)[number];
type NavItem = 'inbox' | 'meetings' | 'contacts';

const MailDisplay = ({ selectedEmail }: { selectedEmail: MailboxItem | null }) => {
    const [formattedDate, setFormattedDate] = React.useState('');

    React.useEffect(() => {
        if (selectedEmail) {
            setFormattedDate(format(new Date(selectedEmail.date), 'PPpp'));
        }
    }, [selectedEmail]);

  if (!selectedEmail) {
    return <div className="flex-1 flex items-center justify-center bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl text-zinc-500 dark:text-white/40">Select an email to read</div>;
  }

  return (
    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col h-full">
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
          {formattedDate && <span className="text-xs text-muted-foreground">{formattedDate}</span>}
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
  );
};

const MailView = () => {
    const [selectedEmail, setSelectedEmail] = React.useState<MailboxItem | null>(emails[0]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_440px_1fr] gap-6 h-full">
            {/* Mailbox Filters/Folders */}
            <div className="hidden md:flex bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex-col p-2">
                <div className="p-2">
                    <Button className="w-full rounded-lg gap-2">
                        <Edit className="h-4 w-4" /> Compose
                    </Button>
                </div>
                <nav className="flex-1 space-y-1 p-2">
                    <a href="#" className="flex items-center gap-3 rounded-lg bg-black/10 dark:bg-white/20 px-3 py-2 text-foreground font-semibold">
                        <Inbox className="h-4 w-4" />
                        Inbox
                        <span className="ml-auto flex h-6 w-9 items-center justify-center rounded-full bg-blue-500/80 text-white text-xs">
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
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl flex flex-col h-full">
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
            <div className="hidden lg:flex h-full">
                <MailDisplay selectedEmail={selectedEmail} />
            </div>
        </div>
    )
}

const MeetingsView = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
                <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
                    <CardHeader>
                        <CardTitle>Upcoming Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="space-y-4">
                            {meetings.map(meeting => (
                                <div key={meeting.id} className="flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-zinc-200/50 dark:border-white/10">
                                    <div className="flex flex-col items-center justify-center w-16">
                                        <span className="text-2xl font-bold">{format(meeting.time, 'h')}</span>
                                        <span className="text-xs uppercase text-muted-foreground">{format(meeting.time, 'a')}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{meeting.title}</h4>
                                        <p className="text-sm text-muted-foreground">{meeting.duration}</p>
                                         <div className="flex items-center gap-2 mt-1">
                                            {meeting.participants.map(p => (
                                                <Avatar key={p.name} className="h-6 w-6 border-2 border-background">
                                                    <AvatarImage src={p.avatar} />
                                                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    </div>
                                    <Button className="rounded-lg gap-2">
                                        <Video className="h-4 w-4" />
                                        Join Meeting
                                    </Button>
                                </div>
                            ))}
                        </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div>
                 <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardContent className="p-0">
                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full"
                        />
                    </CardContent>
                 </Card>
                 <Button className="w-full mt-4 rounded-lg gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule New Meeting
                </Button>
            </div>
        </div>
    )
}

const ContactsView = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
  
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-full">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-white/50" />
              <Input 
                  placeholder="Search contacts..." 
                  className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10 pl-10 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredContacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-zinc-200/50 dark:border-white/10">
                  <Avatar className="h-10 w-10 border-2 border-zinc-200 dark:border-white/20">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

export default function CommunicationsPage() {
  
  const navItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
      { id: 'inbox', label: 'Inbox', icon: Mail },
      { id: 'meetings', label: 'Meetings', icon: Video },
      { id: 'contacts', label: 'Contacts', icon: Users },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-20 backdrop-blur-md px-4 pb-4 -mx-4 -mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
      </div>
      <Tabs defaultValue="inbox" className="flex-1 flex flex-col -mx-4 px-4 pb-4">
        <TabsList className="mb-4 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl h-auto p-2 w-full max-w-sm">
            {navItems.map(item => (
                <TabsTrigger key={item.id} value={item.id} className="w-full flex items-center gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:text-white">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </TabsTrigger>
            ))}
        </TabsList>
        
        <TabsContent value="inbox" className="flex-1 h-full mt-0">
          <MailView />
        </TabsContent>
        <TabsContent value="meetings" className="flex-1 h-full mt-0">
          <MeetingsView />
        </TabsContent>
        <TabsContent value="contacts" className="flex-1 h-full mt-0">
          <ContactsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
