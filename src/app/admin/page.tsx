
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Code, Smartphone, Palette, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { portfolioItems } from '@/components/landing/Portfolio';
import Image from 'next/image';

const totalProjects = portfolioItems.length;
const webProjects = portfolioItems.filter(p => p.category === 'web').length;
const mobileProjects = portfolioItems.filter(p => p.category === 'mobile').length;
const designProjects = portfolioItems.filter(p => p.category === 'design').length;

const projectsByCategoryData = [
  { name: 'Web', count: webProjects },
  { name: 'Mobile', count: mobileProjects },
  { name: 'Design', count: designProjects },
];

const allTags = portfolioItems.flatMap(p => p.tags);
const uniqueTags = [...new Set(allTags)];

const recentProjects = portfolioItems.slice(0, 5);


export default function AdminDashboard() {
  return (
    <main className="flex flex-col h-full pt-4">
        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-4 pb-4 -mx-4">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Works</CardTitle>
            <Briefcase className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalProjects}</div>
            <p className="text-xs text-white/50">Items in your portfolio</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Web Works</CardTitle>
            <Code className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{webProjects}</div>
            <p className="text-xs text-white/50">Web development works</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Mobile Works</CardTitle>
            <Smartphone className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{mobileProjects}</div>
            <p className="text-xs text-white/50">Mobile app works</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Design Works</CardTitle>
            <Palette className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{designProjects}</div>
            <p className="text-xs text-white/50">Branding & UI/UX works</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white/90">Works by Category</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectsByCategoryData}>
                    <defs>
                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsla(210, 100%, 70%, 0.5)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsla(210, 100%, 70%, 0)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.1)" />
                    <XAxis dataKey="name" stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid hsla(0,0%,100%,0.1)',
                            borderRadius: '0.75rem',
                            color: '#fff',
                        }}
                        cursor={{ fill: 'hsla(0,0%,100%,0.1)' }}
                     />
                    <Bar dataKey="count" fill="url(#colorProjects)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
            <CardHeader>
              <CardTitle className="text-white/90">Recent Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.slug} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                        <Image src={project.image} alt={project.title} width={40} height={40} className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/90 font-semibold">{project.title}</p>
                      <p className="text-xs text-white/50">{project.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
       <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-3 mt-6">
          <CardHeader>
            <CardTitle className="text-white/90">Skills & Technologies Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                    <div key={tag} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
    </main>
  );
}

    