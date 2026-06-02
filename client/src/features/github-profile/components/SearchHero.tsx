import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, BookOpen, Swords, Clock, Trash2, X } from 'lucide-react';
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
  onBattle: (user1: string, user2: string) => void;
}

export interface HistoryItem {
  id: string;
  type: 'user' | 'battle';
  username?: string;
  avatarUrl?: string;
  name?: string;
  username1?: string;
  username2?: string;
  timestamp: number;
}

const extractUsername = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return '';
  
  // Regex to match github.com/username or https://github.com/username etc.
  const githubUrlRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-_\.]+)(?:\/.*)?$/i;
  const match = trimmed.match(githubUrlRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return trimmed;
};

export default function SearchHero({ onSelect, onBattle }: SearchHeroProps) {
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [battleTerm1, setBattleTerm1] = useState('');
  const [battleTerm2, setBattleTerm2] = useState('');
  const [recentSearches, setRecentSearches] = useState<HistoryItem[]>([]);
  
  const parsedSearchTerm = React.useMemo(() => extractUsername(searchTerm), [searchTerm]);
  const debouncedSearch = useDebounce(parsedSearchTerm, 500);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: user, isLoading, isError } = useGithubUser(isBattleMode ? '' : debouncedSearch);

  useEffect(() => {
    const handleFocusSearch = (e: KeyboardEvent) => {
      // Focus on Ctrl + K or /
      if (
        (e.ctrlKey && e.key.toLowerCase() === 'k') || 
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleFocusSearch);
    return () => window.removeEventListener('keydown', handleFocusSearch);
  }, []);

  useEffect(() => {
    const existing = localStorage.getItem('recent_searches');
    if (existing) {
      try {
        setRecentSearches(JSON.parse(existing));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveSearchToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const id = item.type === 'user' 
      ? `user-${item.username?.toLowerCase()}`
      : `battle-${item.username1?.toLowerCase()}-${item.username2?.toLowerCase()}`;

    const newHistory = [
      {
        ...item,
        id,
        timestamp: Date.now()
      },
      ...recentSearches.filter(h => h.id !== id)
    ].slice(0, 10);

    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));
  };

  const handleSelectRecent = (item: HistoryItem) => {
    const newHistory = [
      { ...item, timestamp: Date.now() },
      ...recentSearches.filter(h => h.id !== item.id)
    ].slice(0, 10);
    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));

    if (item.type === 'user' && item.username) {
      onSelect(item.username);
    } else if (item.type === 'battle' && item.username1 && item.username2) {
      onBattle(item.username1, item.username2);
    }
  };

  const handleDeleteRecent = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = recentSearches.filter(h => h.id !== id);
    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBattleMode) {
      const u1 = extractUsername(battleTerm1);
      const u2 = extractUsername(battleTerm2);
      if (u1 && u2) {
        saveSearchToHistory({ type: 'battle', username1: u1, username2: u2 });
        onBattle(u1, u2);
      }
    } else {
      const parsedUsername = extractUsername(searchTerm);
      if (user) {
        saveSearchToHistory({ type: 'user', username: user.login, avatarUrl: user.avatar_url, name: user.name });
        onSelect(user.login);
      } else if (parsedUsername) {
        saveSearchToHistory({ type: 'user', username: parsedUsername });
        onSelect(parsedUsername);
      }
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
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-sm font-display">
          GitHub Developer DNA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium">
          Analyze any developer's GitHub profile. Discover stats, language habits, and coding patterns in seconds.
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mt-2">
        <div className="bg-secondary/40 p-1.5 rounded-full border border-border/50 flex space-x-1 backdrop-blur-md">
          <button 
            type="button"
            onClick={() => setIsBattleMode(false)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center cursor-pointer ${!isBattleMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}
          >
            <Search className="w-4 h-4 mr-1.5" /> DNA Analyze
          </button>
          <button 
            type="button"
            onClick={() => setIsBattleMode(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center cursor-pointer ${isBattleMode ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20 scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}
          >
            <Swords className="w-4 h-4 mr-1.5" /> Battle Mode
          </button>
        </div>
      </div>

      {/* Search Input Form */}
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full relative group space-y-4"
      >
        {!isBattleMode ? (
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-indigo-400 transition-colors z-10">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              ref={inputRef}
              type="text" 
              placeholder="Enter a GitHub username... (e.g., torvalds)  [Press '/' to focus]"
              className="w-full h-14 pl-12 pr-32 text-lg rounded-full shadow-sm bg-card/40 backdrop-blur-sm border-2 border-border/60 hover:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <Button type="submit" className="rounded-full px-6 h-10 font-bold shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none cursor-pointer hover:shadow-lg transition-all transform hover:scale-[1.03] active:scale-[0.98]">
                Analyze
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Player 1 username..."
                className="w-full h-14 px-6 text-lg rounded-full shadow-sm bg-card/40 backdrop-blur-sm border-2 border-indigo-500/30 hover:border-indigo-500/60 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all font-medium text-center"
                value={battleTerm1}
                onChange={(e) => setBattleTerm1(e.target.value)}
                required
              />
            </div>
            <div className="hidden md:flex font-black text-xl italic text-muted-foreground mx-2">VS</div>
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Player 2 username..."
                className="w-full h-14 px-6 text-lg rounded-full shadow-sm bg-card/40 backdrop-blur-sm border-2 border-rose-500/30 hover:border-rose-500/60 focus-visible:ring-2 focus-visible:ring-rose-500/50 focus-visible:border-rose-500 transition-all font-medium text-center"
                value={battleTerm2}
                onChange={(e) => setBattleTerm2(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-auto flex justify-center mt-2 md:mt-0">
              <Button type="submit" className="w-full md:w-auto rounded-full px-8 h-14 font-black shadow-lg bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 hover:shadow-indigo-500/10 text-white border-none cursor-pointer text-lg hover:scale-[1.03] active:scale-[0.98] transition-all">
                FIGHT!
              </Button>
            </div>
          </div>
        )}
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

        {user && !isLoading && !isError && !isBattleMode && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            onClick={() => {
              saveSearchToHistory({ type: 'user', username: user.login, avatarUrl: user.avatar_url, name: user.name });
              onSelect(user.login);
            }}
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
                saveSearchToHistory({ type: 'user', username: user.login, avatarUrl: user.avatar_url, name: user.name });
                onSelect(user.login);
              }}
            >
              View Profile
            </Button>
          </motion.div>
        )}
      </div>

      {/* Recently Searched Section */}
      {recentSearches.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full space-y-4 pt-6 border-t border-border/40"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Activities
            </h4>
            <button 
              type="button" 
              onClick={handleClearAllRecent}
              className="text-xs font-semibold text-muted-foreground hover:text-destructive flex items-center gap-1 bg-secondary/30 hover:bg-destructive/10 px-3 py-1 rounded-full border border-border/50 hover:border-destructive/20 transition-all cursor-pointer font-sans"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <AnimatePresence mode="popLayout">
              {recentSearches.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  onClick={() => handleSelectRecent(item)}
                  className="group relative flex items-center p-3 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md hover:bg-card/70 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm overflow-hidden"
                >
                  {/* Glow layer on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.type === 'user' ? 'from-indigo-500/5 to-transparent' : 'from-indigo-500/5 via-rose-500/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                  {item.type === 'user' ? (
                    <>
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.username} className="w-10 h-10 rounded-full border border-border/50 object-cover mr-3 shadow-inner" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center mr-3 text-sm">
                          {item.username?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-6 font-sans">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                          {item.name || item.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate font-semibold">
                          @{item.username}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-rose-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3 relative overflow-hidden">
                        <Swords className="w-5 h-5 text-rose-500 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6 font-sans">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-0.5">
                          <span className="text-indigo-400 font-extrabold">Battle</span>
                        </p>
                        <p className="text-sm font-black text-foreground truncate group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-rose-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                          {item.username1} <span className="text-xs font-bold text-muted-foreground/60 italic">vs</span> {item.username2}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Close/Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteRecent(e, item.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-secondary/35 text-muted-foreground hover:text-foreground hover:bg-secondary/80 opacity-0 group-hover:opacity-100 transition-all border border-border/20 cursor-pointer shadow-sm z-10 focus:opacity-100"
                    aria-label="Remove Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

    </div>
  );
}
