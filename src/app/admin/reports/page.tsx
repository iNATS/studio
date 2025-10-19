
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Users, Palette, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, RadialBar, RadialBarChart, Legend } from 'recharts';
import { initialProjects, clientsData } from '../workspace/data';
import { getProjectVibe, type ProjectVibeInput } from '@/ai/flows/project-insights-flow';
import { useToast } from '@/hooks/use-toast';
import { addMonths, format, startOfMonth } from 'date-fns';

const completedProjects = initialProjects.filter(p => p.status === 'completed');
const totalBilled = completedProjects.reduce((acc, p) => acc + p.budget, 0);

const clientLeaderboard = clientsData.map(client => {
    const clientProjects = initialProjects.filter(p => p.clientId === client.id);
    const totalValue = clientProjects.reduce((acc, p) => acc + p.budget, 0);
    return { ...client, totalValue };
}).sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);


export default function ReportsPage() {
    const { toast } = useToast();
    
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

    const incomeData = React.useMemo(() => {
        const months = Array.from({ length: 6 }).map((_, i) => subMonths(startOfMonth(new Date()), 5 - i));
        return months.map(month => {
            const projectsInMonth = completedProjects.filter(p => isSameMonth(p.endDate, month));
            const income = projectsInMonth.reduce((acc, p) => acc + p.budget, 0);
            return {
                name: format(month, 'MMM'),
                income: income,
            };
        });
    }, []);

    const workloadData = React.useMemo(() => {
        const categories = ['web', 'mobile', 'design'];
        const totalProjects = initialProjects.length;
        const colors = ['#38bdf8', '#818cf8', '#f472b6'];

        return categories.map((cat, index) => {
             const count = initialProjects.filter(p => p.category === cat).length;
             return {
                name: cat.charAt(0).toUpperCase() + cat.slice(1),
                value: count,
                fill: colors[index % colors.length],
             }
        })
    }, []);

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
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white/70">Total Revenue</CardTitle>
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
                            <CardTitle className="text-sm font-medium text-white/70">Completed Projects</CardTitle>
                            <Briefcase className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{completedProjects.length}</div>
                             <p className="text-xs text-white/50">Across all time</p>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                     <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-white/70">Total Clients</CardTitle>
                            <Users className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{clientsData.length}</div>
                             <p className="text-xs text-white/50">All-time client count</p>
                        </CardContent>
                    </Card>
                </motion.div>
                 <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white/70 flex items-center justify-between">
                                Active Projects
                                <Activity className="h-5 w-5 text-orange-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="text-3xl font-bold text-white">{initialProjects.filter(p => p.status === 'in-progress').length}</div>
                           <p className="text-xs text-white/50">Currently in progress</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

             <motion.div 
                className="grid gap-6 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="lg:col-span-2">
                     <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl h-full">
                        <CardHeader>
                            <CardTitle className="text-white/90 text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5"/>6-Month Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={incomeData}>
                                     <defs>
                                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="hsla(0, 0%, 100%, 0.4)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsla(0, 0%, 100%, 0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: 'hsla(0, 0%, 100%, 0.1)', radius: 4 }}
                                        contentStyle={{
                                            background: 'rgba(20, 20, 22, 0.8)',
                                            border: '1px solid hsla(0,0%,100%,0.1)',
                                            borderRadius: '0.75rem',
                                            color: '#fff',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                        formatter={(value) => [value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), "Income"]}
                                     />
                                    <Bar dataKey="income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl h-full">
                        <CardHeader>
                             <CardTitle className="text-white/90 text-lg flex items-center gap-2"><Palette className="h-5 w-5"/>Workload</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ResponsiveContainer width="100%" height={250}>
                                <RadialBarChart 
                                    innerRadius="30%" 
                                    outerRadius="100%" 
                                    data={workloadData} 
                                    startAngle={90} 
                                    endAngle={-270}
                                >
                                    <RadialBar
                                        background
                                        dataKey='value'
                                        className="[&_.recharts-radial-bar-background-sector]:fill-white/5"
                                     />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{color: 'white', fontSize: '14px'}} />
                                     <Tooltip
                                        contentStyle={{
                                            background: 'rgba(20, 20, 22, 0.8)',
                                            border: '1px solid hsla(0,0%,100%,0.1)',
                                            borderRadius: '0.75rem',
                                            color: '#fff',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                        formatter={(value, name) => [`${value} projects`, name]}
                                     />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                 className="mt-6"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-white/90 text-lg flex items-center gap-2"><Users className="h-5 w-5"/>Top Clients by Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {clientLeaderboard.map((client, index) => (
                                <div key={client.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white/50 w-4">{index + 1}.</span>
                                        <div className="font-medium text-white/90">{client.name}</div>
                                        <div className="text-xs text-white/60">{client.company}</div>
                                    </div>
                                    <div className="font-mono text-lg text-green-300">{client.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

        </main>
    );
}

const isSameMonth = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

    