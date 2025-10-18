
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, DollarSign, Briefcase, Users, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialProjects, clientsData } from '../workspace/data';
import type { Project } from '../workspace/projects/page';
import { getProjectVibe, ProjectVibeInput } from '@/ai/flows/project-insights-flow';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProjectWithVibe = Project & {
    vibe?: {
        aesthetic: string;
        keywords: string[];
    };
    clientName?: string;
};

const completedProjects = initialProjects.filter(p => p.status === 'completed');
const totalBilled = completedProjects.reduce((acc, p) => acc + p.budget, 0);
const avgBudget = totalBilled / (completedProjects.length || 1);

const clientLeaderboard = clientsData.map(client => {
    const clientProjects = initialProjects.filter(p => p.clientId === client.id);
    const totalValue = clientProjects.reduce((acc, p) => acc + p.budget, 0);
    return { ...client, totalValue };
}).sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);


export default function ReportsPage() {
    const [projectsWithVibes, setProjectsWithVibes] = React.useState<ProjectWithVibe[]>(completedProjects.map(p => ({
        ...p,
        clientName: clientsData.find(c => c.id === p.clientId)?.name
    })));
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const { toast } = useToast();

    const handleGenerateVibe = async (projectId: string) => {
        const project = projectsWithVibes.find(p => p.id === projectId);
        if (!project) return;

        setIsLoading(prev => ({ ...prev, [projectId]: true }));

        try {
            const input: ProjectVibeInput = {
                projectTitle: project.title,
                projectDescription: project.description,
            };
            const result = await getProjectVibe(input);
            
            setProjectsWithVibes(prev => prev.map(p => p.id === projectId ? { ...p, vibe: result } : p));

            toast({
                title: 'Vibe Generated!',
                description: `AI analysis for "${project.title}" is complete.`,
            });

        } catch (error) {
            console.error('Error generating project vibe:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not generate AI insights for this project.',
            });
        } finally {
            setIsLoading(prev => ({ ...prev, [projectId]: false }));
        }
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <main className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pt-4 pb-4 -mx-4">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-3xl font-bold text-white tracking-tight"
                >
                    Analytics & Insights
                </motion.h1>
            </div>
            
            <motion.div 
                className="grid gap-6 md:grid-cols-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white/70">Total Billed</CardTitle>
                            <DollarSign className="h-5 w-5 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{totalBilled.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                            <p className="text-xs text-white/50">From {completedProjects.length} completed projects</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                     <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white/70">Avg. Project Budget</CardTitle>
                            <Briefcase className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{avgBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</div>
                             <p className="text-xs text-white/50">Across all projects</p>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/70 flex items-center justify-between">
                                Client Leaderboard
                                <Users className="h-5 w-5 text-purple-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {clientLeaderboard.map((client, index) => (
                                    <div key={client.id} className="flex justify-between items-center text-xs">
                                        <span className="text-white/80">{index + 1}. {client.name}</span>
                                        <span className="font-mono text-purple-300">{client.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div 
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white/90 text-xl">Project Insights</CardTitle>
                        <CardContent className="text-white/60 p-0 pt-2">
                            Generate AI-powered creative analyses for your completed projects to uncover design trends and themes in your work.
                        </CardContent>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-4 -mr-4">
                            <motion.div 
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {projectsWithVibes.map((project) => (
                                    <motion.div key={project.id} variants={itemVariants}>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full flex flex-col justify-between hover:bg-white/10 transition-colors group">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-white/90">{project.title}</h4>
                                                    <span className="font-mono text-xs text-green-300/80">{project.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</span>
                                                </div>
                                                <p className="text-xs text-white/60 mb-3">{project.clientName}</p>
                                                {project.vibe ? (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Palette className="h-4 w-4 text-purple-300" />
                                                            <p className="text-sm font-semibold text-white/80">{project.vibe.aesthetic}</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.vibe.keywords.map(kw => (
                                                                <Badge key={kw} variant="outline" className="text-xs text-white/70 bg-white/5 border-white/10">{kw}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-white/50 italic">No AI insights generated yet.</p>
                                                )}
                                            </div>
                                             <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="w-full mt-4 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90"
                                                onClick={() => handleGenerateVibe(project.id)}
                                                disabled={isLoading[project.id]}
                                            >
                                                {isLoading[project.id] ? (
                                                    <Bot className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                     <Bot className="mr-2 h-4 w-4" />
                                                )}
                                                Generate Vibe
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    );
}
