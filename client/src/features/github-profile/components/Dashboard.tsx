import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon, 
  Calendar, 
  Star, 
  BookOpen, 
  Users, 
  GitFork, 
  AlertCircle, 
  Sparkles,
  SearchIcon,
  Moon,
  Sun,
  ShieldCheck
} from 'lucide-react';

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
import { useGithubUser, useGithubRepos, useGithubStats } from '../api/queries';
import RepositoryExplorer from './RepositoryExplorer';
import AnalyticsSection from './AnalyticsSection';
import AICareerAdvisor from './AICareerAdvisor';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';

interface DashboardProps {
  username: string;
  onBack: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  Ruby: '#701516',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  Kotlin: '#A97BFF',
  C: '#555555'
};
export default function Dashboard({ username, onBack, darkMode, toggleDarkMode }: DashboardProps) {
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [activeUsername, setActiveUsername] = useState(username);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Queries
  const { data: user, isLoading: userLoading, isError: userError } = useGithubUser(activeUsername);
  const { data: repos, isLoading: reposLoading } = useGithubRepos(activeUsername);
  const { data: stats, isLoading: statsLoading } = useGithubStats(activeUsername);

  // Header quick search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dashboardSearch.trim()) {
      setActiveUsername(dashboardSearch.trim());
      setDashboardSearch('');
      setSelectedLanguage(null);
    }
  };

  // Language percentage calculations
  const languagesList = useMemo(() => {
    if (!stats?.topLanguages) return [];
    const entries = Object.entries(stats.topLanguages);
    const totalCount = entries.reduce((sum, [_, count]) => sum + count, 0);
    return entries
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
        color: LANGUAGE_COLORS[name] || '#8b949e'
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  // Derived Developer Badges
  const developerBadges = useMemo(() => {
    if (!user || !stats) return [];
    const badges = [];

    // Experience badge
    if (user.public_repos > 40) {
      badges.push({ text: 'Prolific Creator', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' });
    } else {
      badges.push({ text: 'Repository Builder', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' });
    }

    // Stars badge
    if (stats.totalStars > 100) {
      badges.push({ text: 'Community Favorite', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' });
    } else if (stats.totalStars > 10) {
      badges.push({ text: 'Rising Star', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' });
    }

    // Followers badge
    if (user.followers > 100) {
      badges.push({ text: 'Social Influencer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' });
    }

    // Primary language badge
    if (languagesList.length > 0) {
      const topLang = languagesList[0].name;
      badges.push({ text: `${topLang} Developer`, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' });
    }

    return badges;
  }, [user, stats, languagesList]);

  // Dynamic AI Profile Summary Description
  const developerDNAInsight = useMemo(() => {
    if (!user || !stats || languagesList.length === 0) return '';
    const topLang = languagesList[0].name;
    const repoCount = user.public_repos;
    const starCount = stats.totalStars;

    let narrative = '';
    if (['TypeScript', 'JavaScript'].includes(topLang)) {
      narrative = `Specializes in modern web applications. Confidently leverages full-stack architectures, demonstrating strong knowledge in responsive rendering, modular assets, and browser engines.`;
    } else if (['Python', 'R'].includes(topLang)) {
      narrative = `Focuses heavily on data automation, analytical intelligence, or artificial intelligence algorithms. Excellent at assembling data pipelines and model pipelines.`;
    } else if (['Rust', 'Go', 'C++', 'C'].includes(topLang)) {
      narrative = `Systems architect prioritizing peak application performance, backend throughput, high concurrency models, and low-latency memory boundaries.`;
    } else {
      narrative = `Versatile developer proficient in multi-paradigm languages, showing capabilities to quickly adapt across technical barriers and deliver robust solutions.`;
    }

    const activityRating = repoCount > 50 ? 'exceptionally high' : repoCount > 20 ? 'steady and consistent' : 'structured';
    const impactRating = starCount > 100 ? 'leading to strong open-source resonance' : starCount > 10 ? 'generating notable user interest' : 'focused on functional execution';

    return `${narrative} Exhibits an ${activityRating} workflow with ${repoCount} projects, ${impactRating} across the ecosystem.`;
  }, [user, stats, languagesList]);



  // Handle loading state
  if (userLoading || reposLoading || statsLoading) {
    return (
      <div className="w-full space-y-8 py-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/50 pb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-full max-w-sm rounded-full" />
        </div>

        {/* Profile Card Skeleton */}
        <div className="grid grid-cols-1 gap-8">
          <div className="p-8 rounded-2xl border bg-card flex flex-col md:flex-row items-center md:items-start gap-8">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl border bg-card space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>

        {/* Two Column Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl border bg-card space-y-4">
              <Skeleton className="h-6 w-32" />
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-2">
                  <div className="flex justify-between"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-8" /></div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 p-6 rounded-2xl border bg-card space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full" />
            {[1, 2].map((n) => (
              <div key={n} className="p-4 rounded-xl border space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4"><Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-12" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (userError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
        <div className="p-4 bg-destructive/10 rounded-full border border-destructive/20 text-destructive animate-pulse">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Error Fetching Profile</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We couldn't retrieve profile information for <span className="font-semibold text-foreground">"{activeUsername}"</span>. 
            This developer may not exist or the GitHub API is currently rate-limited.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Button>
          <Button onClick={() => setActiveUsername(username)} className="rounded-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Stagger variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="w-full space-y-8 py-2 relative min-h-screen">
      
      {/* 1. Header Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6 w-full"
      >
        <div className="flex items-center space-x-3 self-start sm:self-center">
          <Button variant="ghost" onClick={onBack} className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Search
          </Button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DNA Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Dashboard Quick Lookup Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64 max-w-sm">
            <SearchIcon className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Quick search user..."
              className="pl-9 pr-4 py-1.5 h-9 rounded-full bg-secondary/30 border-border/50 text-sm focus-visible:ring-primary"
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
            />
          </form>

          {/* Theme Switcher Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full border-border/50 bg-secondary/10 hover:bg-secondary/40 h-9 w-9"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main Dashboard Layout Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* 2. Glassmorphic Profile Banner */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-border/30 bg-card/40 backdrop-blur-md relative bg-grid-pattern shadow-md">
            
            {/* Cache Status Badge */}
            {user.cached && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Cached Response
              </div>
            )}

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                
                {/* Big avatar image with pulsing ring */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
                  <img 
                    src={user.avatar_url} 
                    alt={user.login} 
                    className="relative w-28 h-28 rounded-full border-2 border-background object-cover shadow-xl"
                  />
                </div>

                {/* Profile Information details */}
                <div className="flex-1 flex flex-col items-center md:items-start space-y-4 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 text-center md:text-left">
                    <div>
                      <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{user.name || user.login}</h2>
                      <p className="text-indigo-400 font-semibold mt-0.5">@{user.login}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                      <Button variant="outline" size="sm" className="rounded-full border-border/40 hover:bg-secondary" asChild>
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" /> GitHub Profile
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Profile Bio */}
                  {user.bio ? (
                    <p className="text-base text-foreground/85 text-center md:text-left max-w-2xl leading-relaxed">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No bio provided by this developer.</p>
                  )}

                  {/* Badges Container */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    {developerBadges.map((badge, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badge.color}`}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>

                  {/* Meta Details footer in Card */}
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-2 gap-x-6 text-sm text-muted-foreground pt-2 border-t border-border/20 w-full">
                    {user.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.company && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span>{user.company}</span>
                      </div>
                    )}
                    {user.blog && (
                      <div className="flex items-center gap-1.5 max-w-xs truncate">
                        <LinkIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <a 
                          href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-indigo-400 underline transition-colors truncate"
                        >
                          {user.blog.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                    {user.created_at && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <span>
                          Joined {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. 4-Column High-Fidelity Stats Grid */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Total Stars */}
          <div className="p-6 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total Stars</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                <Star className="w-5 h-5 fill-amber-500/10" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-foreground">{stats?.totalStars || 0}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Across all public repositories</p>
            </div>
          </div>

          {/* Card 2: Public Repos */}
          <div className="p-6 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Public Repos</span>
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-foreground">{user.public_repos}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Hosted code workspaces</p>
            </div>
          </div>

          {/* Card 3: Followers */}
          <div className="p-6 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Followers</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-foreground">{user.followers}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Developers tracking updates</p>
            </div>
          </div>

          {/* Card 4: Forks */}
          <div className="p-6 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-md flex flex-col justify-between h-32 hover:scale-[1.02] transition-transform duration-300 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Total Forks</span>
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                <GitFork className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-foreground">{stats?.totalForks || 0}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Projects branched by others</p>
            </div>
          </div>
        </motion.div>

        {/* 4. Two-Column Insights & Repository Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Language DNA & Insight Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
            
            {/* Language Breakdown */}
            <Card className="border-border/30 bg-card/40 backdrop-blur-md relative overflow-hidden shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Language DNA
                </CardTitle>
                <CardDescription>Primary technical stack distribution</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {languagesList.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No primary programming languages detected.
                  </p>
                ) : (
                  <>
                    {/* Concentric Progress Bar Visual */}
                    <div className="w-full flex h-3.5 rounded-full overflow-hidden bg-secondary/40 my-3">
                      {languagesList.slice(0, 5).map((lang, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color 
                          }}
                          title={`${lang.name}: ${lang.percentage}%`}
                          className="h-full transition-all"
                        />
                      ))}
                    </div>

                    {/* Detailed List */}
                    <div className="space-y-4 pt-1">
                      {languagesList.map((lang, index) => (
                        <div 
                          key={index}
                          onClick={() => setSelectedLanguage(selectedLanguage === lang.name ? null : lang.name)}
                          className={`space-y-1.5 cursor-pointer p-1.5 rounded-lg transition-colors hover:bg-secondary/40 ${
                            selectedLanguage === lang.name ? 'bg-secondary/50 border border-indigo-500/25' : 'border border-transparent'
                          }`}
                        >
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-2.5">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: lang.color }}
                              />
                              <span className="font-semibold text-foreground/90">{lang.name}</span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground">
                              {lang.count} {lang.count === 1 ? 'repo' : 'repos'} ({lang.percentage}%)
                            </span>
                          </div>
                          
                          {/* Individual Progress bar */}
                          <div className="w-full h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${lang.percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: lang.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedLanguage && (
                      <div className="pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedLanguage(null)}
                          className="w-full text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/5 rounded-lg border border-indigo-500/10"
                        >
                          Show All Languages
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Profile DNA AI Insights Narrative */}
            <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm relative overflow-hidden bg-grid-pattern">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  DNA Insights
                </CardTitle>
                <CardDescription>System computed developer intelligence</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {developerDNAInsight ? (
                  <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/20 backdrop-blur-sm">
                    {developerDNAInsight}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-4">
                    Insights unavailable. Insufficient repository metadata.
                  </p>
                )}
              </CardContent>
            </Card>

          </motion.div>

          {/* Right Column: Repository DNA Showcase (Interactive Repository Explorer) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <Card className="border-border/30 bg-card/40 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                  Repository DNA Explorer
                </CardTitle>
                <CardDescription>
                  Search, sort, filter, and expand workspace repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RepositoryExplorer 
                  repos={repos || []} 
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* 5. AI Career Advisor Section */}
        <AICareerAdvisor 
          profileData={{
            username: user.login,
            publicRepos: user.public_repos,
            followers: user.followers,
            totalStars: stats?.totalStars,
            topLanguages: languagesList.map(l => l.name),
            developerType: developerBadges.map(b => b.text).join(', ')
          }} 
        />

        {/* 6. Analytics Section */}
        <AnalyticsSection 
          repos={repos || []} 
          languagesList={languagesList} 
        />

      </motion.div>
    </div>
  );
}
