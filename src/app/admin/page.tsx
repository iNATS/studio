'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity, ArrowUp, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, LineChart } from 'recharts';


const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
  { month: 'Jul', revenue: 7000 },
];

const userActivityData = [
  { hour: '12AM', users: 120 },
  { hour: '3AM', users: 150 },
  { hour: '6AM', users: 250 },
  { hour: '9AM', users: 500 },
  { hour: '12PM', users: 800 },
  { hour: '3PM', users: 700 },
  { hour: '6PM', users: 600 },
  { hour: '9PM', users: 400 },
];

const recentActivities = [
    { user: 'Olivia Martin', action: 'upgraded to Pro', time: '12m ago', avatar: 'https://picsum.photos/seed/olivia/40/40' },
    { user: 'Jackson Lee', action: 'completed a project', time: '34m ago', avatar: 'https://picsum.photos/seed/jackson/40/40' },
    { user: 'Isabella Nguyen', action: 'commented on a task', time: '52m ago', avatar: 'https://picsum.photos/seed/isabella/40/40' },
    { user: 'William Kim', action: 'joined a new team', time: '1h ago', avatar: 'https://picsum.photos/seed/william/40/40' },
    { user: 'Sofia Davis', action: 'uploaded 5 new files', time: '2h ago', avatar: 'https://picsum.photos/seed/sofia/40/40' },
]

export default function AdminDashboard() {
  return (
    <main className="flex flex-1 flex-col gap-6 w-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$45,231.89</div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Subscriptions</CardTitle>
            <Users className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+2350</div>
            <p className="text-xs text-green-400 flex items-center">
             <ArrowUp className="h-4 w-4 mr-1" /> +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Sales</CardTitle>
            <CreditCard className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+12,234</div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl transition-all duration-300 hover:border-white/20 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Now</CardTitle>
            <Activity className="h-5 w-5 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+573</div>
            <p className="text-xs text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white/90">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsla(210, 100%, 70%, 0.5)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsla(210, 100%, 70%, 0)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.1)" />
                    <XAxis dataKey="month" stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}K`} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid hsla(0,0%,100%,0.1)',
                            borderRadius: '0.75rem',
                            color: '#fff',
                        }}
                        cursor={{ fill: 'hsla(0,0%,100%,0.1)' }}
                     />
                    <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
            <CardHeader>
              <CardTitle className="text-white/90">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.user} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/90"><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                      <p className="text-xs text-white/50">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
       <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white/90">Live User Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userActivityData}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsla(150, 100%, 70%, 0.5)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsla(150, 100%, 70%, 0)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.05)" />
                    <XAxis dataKey="hour" stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsla(0,0%,100%,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            border: '1px solid hsla(0,0%,100%,0.1)',
                            borderRadius: '0.75rem',
                            color: '#fff',
                        }}
                        cursor={{ fill: 'hsla(0,0%,100%,0.1)' }}
                     />
                    <Line type="monotone" dataKey="users" stroke="hsla(150, 100%, 70%, 1)" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    </main>
  );
}
