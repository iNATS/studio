
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, KeyRound, Bell, Languages, Mail, MessageSquare, BarChart, Settings2, Code, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
    const { toast } = useToast();
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>('https://yt3.googleusercontent.com/-ZvNMRTRJAdZN2n4mi8C32PvY_atHV3Zsrn1IAHthDnjxIGjwr9KTg9ww9mWS-5A-E3IPwbpSA=s900-c-k-c0x00ffffff-no-rj');
    
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, section: string) => {
        e.preventDefault();
        toast({
            title: 'Settings Saved',
            description: `${section} settings have been updated.`,
        });
    };
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select an image file.' });
        }
    };

  return (
    <main className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md pt-4 pb-4 -mx-4 -mt-4 px-4">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-8">
         <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-lg">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Update your public profile details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={(e) => handleFormSubmit(e, 'Profile')}>
                    <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 border-2 border-zinc-200 dark:border-white/10">
                                {avatarPreview && <AvatarImage src={avatarPreview} alt="Avatar Preview" />}
                                <AvatarFallback>MA</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                <Label htmlFor="avatar-upload" className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload New Image
                                </Label>
                                <p className="text-xs text-zinc-500 dark:text-white/50 mt-2">PNG, JPG, WEBP up to 5MB.</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Mohamed Aref" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="title">Professional Title</Label>
                            <Input id="title" defaultValue="Creative Developer & Designer" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Public Bio</Label>
                        <Textarea id="bio" defaultValue="I build beautiful, functional, and user-centric digital experiences." className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="rounded-lg">Save Profile</Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" />Security</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Manage your account security settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={(e) => handleFormSubmit(e, 'Security')}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="mohamed.aref@example.com" readOnly className="bg-black/10 dark:bg-white/10 border-zinc-300 dark:border-white/10 cursor-not-allowed" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="rounded-lg">Update Password</Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
             <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="task-overdue-notif" className="font-semibold">Overdue Tasks</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Notify me when a task becomes overdue.</p>
                    </div>
                    <Switch id="task-overdue-notif" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="client-message-notif" className="font-semibold">New Client Messages</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Send an email when a new message is received.</p>
                    </div>
                    <Switch id="client-message-notif" />
                </div>
                 <div className="flex items-center justify-between p-4 rounded-lg bg-black/5 dark:bg-white/5">
                    <div>
                        <Label htmlFor="project-complete-notif" className="font-semibold">Project Completion</Label>
                        <p className="text-sm text-zinc-600 dark:text-white/60">Get a summary when a project is marked as complete.</p>
                    </div>
                    <Switch id="project-complete-notif" defaultChecked />
                </div>
              </CardContent>
            </Card>

             <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5" />Language</CardTitle>
                <CardDescription className="text-zinc-600 dark:text-white/60">Choose your preferred language for the interface.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Select defaultValue="en">
                    <SelectTrigger className="max-w-xs bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                    </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5" />Marketing & Analytics</CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-white/60">Connect your marketing and analytics tools.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="ga-id" className="flex items-center gap-2"><Code className="h-4 w-4" /> Google Analytics ID</Label>
                            <Input id="ga-id" placeholder="G-XXXXXXXXXX" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meta-pixel" className="flex items-center gap-2"><Bot className="h-4 w-4" /> Meta Pixel ID</Label>
                            <Input id="meta-pixel" placeholder="Your Meta Pixel ID" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                        </div>
                         <div className="flex justify-end">
                            <Button type="submit" className="rounded-lg">Save Analytics</Button>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl border-zinc-200/50 dark:border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings2 className="h-5 w-5" />Communication</CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-white/60">Configure your mail and chat settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10">
                            <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" /> Mail Server</h4>
                             <Select defaultValue="default">
                                <SelectTrigger className="bg-black/5 dark:bg-white/5 border-zinc-300 dark:border-white/10">
                                    <SelectValue placeholder="Select mail provider" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/80 backdrop-blur-xl border-zinc-200/50 dark:border-white/10 text-foreground dark:text-white">
                                    <SelectItem value="default">Default (No-reply)</SelectItem>
                                    <SelectItem value="smtp">SMTP</SelectItem>
                                    <SelectItem value="resend">Resend</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="space-y-2">
                                <Label htmlFor="mail-api-key">API Key</Label>
                                <Input id="mail-api-key" type="password" placeholder="Enter API Key" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10" />
                            </div>
                        </div>
                         <div className="space-y-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10">
                             <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat Widget</h4>
                                <Switch id="chat-enabled" />
                             </div>
                             <p className="text-sm text-zinc-600 dark:text-white/60">Enable or disable the customer chat widget on your portfolio.</p>
                            <div className="space-y-2">
                                <Label htmlFor="chat-script">Chat Provider Script/ID</Label>
                                <Textarea id="chat-script" placeholder="Paste your chat widget script or ID here" className="bg-black/5 dark:bg-white/10 border-zinc-300 dark:border-white/10 text-xs" rows={3}/>
                            </div>
                        </div>
                         <div className="flex justify-end">
                            <Button type="submit" className="rounded-lg">Save Communication</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
}
