import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Github, Users, BookOpen } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { useGithubUser } from '../api/queries';

export default function SearchHero() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: user, isLoading, isError, error } = useGithubUser(debouncedSearch);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full max-w-3xl mx-auto space-y-8">
      {/* Hero Title */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Github className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          GitHub Developer DNA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          Analyze any developer's GitHub profile. Discover stats, language habits, and coding patterns in seconds.
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full relative group"
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <Input 
          type="text" 
          placeholder="Enter a GitHub username... (e.g., torvalds)"
          className="w-full h-14 pl-12 pr-32 text-lg rounded-full shadow-sm bg-background/50 backdrop-blur-sm border-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button className="rounded-full px-6 h-10 font-semibold shadow-md">
            Analyze
          </Button>
        </div>
      </motion.div>

      {/* Results Area */}
      <div className="w-full min-h-[150px] mt-8">
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center space-x-4 p-6 rounded-2xl border bg-card shadow-sm"
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

        {isError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-6 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20"
          >
            <p className="font-medium text-lg">Developer not found</p>
            <p className="text-sm opacity-80 mt-1">Please check the username and try again.</p>
          </motion.div>
        )}

        {user && !isLoading && !isError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full border-2 border-primary/20" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground">{user.name || user.login}</h3>
              <p className="text-sm text-muted-foreground mt-1">@{user.login}</p>
              {user.bio && <p className="text-sm mt-3 text-foreground/80 leading-relaxed">{user.bio}</p>}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-medium text-foreground">{user.followers}</span>&nbsp;followers
                </div>
                <div className="flex items-center text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="font-medium text-foreground">{user.public_repos}</span>&nbsp;repos
                </div>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex rounded-full">
              View Profile
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
