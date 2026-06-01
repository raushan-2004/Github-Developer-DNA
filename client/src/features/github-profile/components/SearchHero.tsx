import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, BookOpen } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { useDebounce } from '../../../hooks/useDebounce';
import { useGithubUser } from '../api/queries';

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

interface SearchHeroProps {
  onSelect: (username: string) => void;
}

export default function SearchHero({ onSelect }: SearchHeroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: user, isLoading, isError } = useGithubUser(debouncedSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSelect(user.login);
    } else if (searchTerm.trim()) {
      onSelect(searchTerm.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 w-full max-w-3xl mx-auto space-y-8">
      {/* Hero Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/5 rounded-full border border-primary/10 relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
            <Github className="w-12 h-12 text-foreground relative" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
          GitHub Developer DNA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium">
          Analyze any developer's GitHub profile. Discover stats, language habits, and coding patterns in seconds.
        </p>
      </motion.div>

      {/* Search Input Form */}
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full relative group"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <Input 
          type="text" 
          placeholder="Enter a GitHub username... (e.g., torvalds)"
          className="w-full h-14 pl-12 pr-32 text-lg rounded-full shadow-sm bg-card/40 backdrop-blur-sm border-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button type="submit" className="rounded-full px-6 h-10 font-semibold shadow-md bg-indigo-600 hover:bg-indigo-500 text-white border-none cursor-pointer">
            Analyze
          </Button>
        </div>
      </motion.form>

      {/* Results Area */}
      <div className="w-full min-h-[150px] mt-4">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center space-x-4 p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm border-border/50"
          >
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-4 pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </motion.div>
        )}

        {isError && searchTerm && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 backdrop-blur-sm"
          >
            <p className="font-semibold text-lg">Developer not found</p>
            <p className="text-sm opacity-80 mt-1">Please check the username and try again.</p>
          </motion.div>
        )}

        {user && !isLoading && !isError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            onClick={() => onSelect(user.login)}
            className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 rounded-2xl border bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-lg hover:border-indigo-500/20 transition-all cursor-pointer group relative overflow-hidden bg-grid-pattern"
          >
            {/* Glow border on hover */}
            <div className="absolute -inset-px rounded-2xl border border-indigo-500/0 group-hover:border-indigo-500/10 transition-colors pointer-events-none" />

            <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full border-2 border-indigo-500/10 group-hover:border-indigo-500/30 object-cover shadow-sm transition-colors" />
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-400 transition-colors">{user.name || user.login}</h3>
              <p className="text-sm text-indigo-400/90 font-medium">@{user.login}</p>
              {user.bio && <p className="text-sm mt-3 text-foreground/80 leading-relaxed font-medium line-clamp-2">{user.bio}</p>}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/30">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  <span className="font-bold text-foreground">{user.followers}</span>&nbsp;followers
                </div>
                <div className="flex items-center text-xs font-semibold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/30">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                  <span className="font-bold text-foreground">{user.public_repos}</span>&nbsp;repos
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="hidden md:flex rounded-full border-border/50 bg-background/50 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-colors group-hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(user.login);
              }}
            >
              View Profile
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
