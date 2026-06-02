import { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, Area,
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import type { GitHubRepo } from '../api/queries';
import { PieChart as PieChartIcon, BarChart2, Activity, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsSectionProps {
  repos: GitHubRepo[];
  languagesList: { name: string; count: number; percentage: number; color: string }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 border border-border/50 text-popover-foreground shadow-xl rounded-lg p-3 text-sm backdrop-blur-md">
        <p className="font-semibold mb-1">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span>{entry.name}: <span className="font-bold">{entry.value}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsSection({ repos, languagesList }: AnalyticsSectionProps) {
  // 1. Top 10 Starred Repos for Bar Chart
  const topStarredRepos = useMemo(() => {
    return [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name,
        fullName: repo.name,
        stars: repo.stargazers_count,
      }));
  }, [repos]);

  // 2. Technology Usage (Topics)
  const topTopics = useMemo(() => {
    const topicCounts: Record<string, number> = {};
    repos.forEach(repo => {
      (repo.topics || []).forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    
    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({
        name,
        count
      }));
  }, [repos]);

  // 3. Activity Summary (Repos updated by Year)
  const activityData = useMemo(() => {
    const yearCounts: Record<string, number> = {};
    repos.forEach(repo => {
      const year = new Date(repo.updated_at).getFullYear().toString();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    return Object.entries(yearCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({
        year,
        Updates: count
      }));
  }, [repos]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  if (repos.length === 0) return null;

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      {/* Language Distribution Pie Chart */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChartIcon className="w-4.5 h-4.5 text-indigo-400" />
            Language Distribution
          </CardTitle>
          <CardDescription>Breakdown of top languages across repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languagesList}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  animationDuration={1500}
                  animationBegin={200}
                >
                  {languagesList.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value) => (
                    <span className="text-foreground/80 font-medium text-sm ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Repository Stars Bar Chart */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="w-4.5 h-4.5 text-amber-400" />
            Top Repositories by Stars
          </CardTitle>
          <CardDescription>Most starred repositories in the workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topStarredRepos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'currentColor', opacity: 0.05 }}
                  content={<CustomTooltip />}
                />
                <Bar 
                  dataKey="stars" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  name="Stars"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Technology Usage Chart */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-emerald-400" />
            Technology Usage
          </CardTitle>
          <CardDescription>Most frequently used topics and technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {topTopics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTopics} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" horizontal={false} />
                  <XAxis 
                    type="number" 
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.8 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'currentColor', opacity: 0.05 }}
                    content={<CustomTooltip />}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#10b981" 
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                    name="Repositories"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                No technology topics found in repositories.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary Area Chart */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-rose-400" />
            Activity Summary
          </CardTitle>
          <CardDescription>Repository update activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {activityData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Updates" 
                    stroke="#f43f5e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUpdates)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                Not enough historical data to generate activity chart.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </motion.div>
  );
}
