import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity, ArrowUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';


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

export default function AdminDashboard() {
  return (
    <main className="flex flex-1 flex-col gap-8 w-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
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
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
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
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
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
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
          <CardHeader>
            <CardTitle className="text-white/90">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
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
                    <Bar dataKey="revenue" fill="hsla(210, 100%, 70%, 0.8)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-2xl border-white/10 shadow-xl rounded-2xl col-span-1">
          <CardHeader>
            <CardTitle className="text-white/90">User Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(0,0%,100%,0.1)" />
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
                    <Bar dataKey="users" fill="hsla(150, 100%, 70%, 0.8)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
