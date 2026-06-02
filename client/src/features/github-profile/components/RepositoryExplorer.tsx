import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Star, 
  GitFork, 
  Eye, 
  AlertCircle, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Tag,
  Code2
} from 'lucide-react';
import { type GitHubRepo } from '../api/queries';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface RepositoryExplorerProps {
  repos: GitHubRepo[];
  selectedLanguage?: string | null;
  setSelectedLanguage?: (lang: string | null) => void;
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

const ITEMS_PER_PAGE = 6;

export default function RepositoryExplorer({ 
  repos,
  selectedLanguage: propLanguage,
  setSelectedLanguage: propSetSelectedLanguage
}: RepositoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'updated'>('stars');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRepoId, setExpandedRepoId] = useState<number | null>(null);
  const [localLanguage, setLocalLanguage] = useState<string | null>(null);

  const selectedLanguage = propLanguage !== undefined ? propLanguage : localLanguage;
  const setSelectedLanguage = propSetSelectedLanguage !== undefined ? propSetSelectedLanguage : setLocalLanguage;

  // Extract unique languages present in this developer's repos for sub-filtering
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  // Handle expanding / collapsing
  const toggleExpand = (repoId: number) => {
    setExpandedRepoId(expandedRepoId === repoId ? null : repoId);
  };

  // Filter & Sort Repositories
  const processedRepos = useMemo(() => {
    let result = [...repos];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(q) || 
        (repo.description && repo.description.toLowerCase().includes(q))
      );
    }

    // 2. Language Filter
    if (selectedLanguage) {
      result = result.filter(repo => repo.language === selectedLanguage);
    }

    // 3. Sorting Algorithms
    result.sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      return 0;
    });

    return result;
  }, [repos, searchQuery, sortBy, selectedLanguage]);

  // Pagination bounds
  const totalPages = Math.max(1, Math.ceil(processedRepos.length / ITEMS_PER_PAGE));
  
  // Safe adjustment when items list shrinks due to filtering
  const activePage = Math.min(currentPage, totalPages);
  
  const paginatedRepos = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return processedRepos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedRepos, activePage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedRepoId(null); // Collapse expanded drawer when changing page
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Filtering & Sorting Toolbar Panel */}
      <div className="flex flex-col gap-4 bg-secondary/10 p-5 rounded-2xl border border-border/30 backdrop-blur-sm no-print">
        
        {/* Row 1: Search & Sort Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute inset-y-0 left-3 my-auto w-4.5 h-4.5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search workspaces by name or description..."
              className="pl-10 rounded-xl bg-background/50 border-border/40 text-sm focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto self-start md:self-center pb-1 md:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground mr-1 flex-shrink-0" />
            <span className="text-xs font-bold text-muted-foreground mr-1 flex-shrink-0 uppercase tracking-wider">Sort:</span>
            
            <Button
              variant={sortBy === 'stars' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSortBy('stars'); setCurrentPage(1); }}
              className="rounded-full h-8 text-xs font-semibold px-4 cursor-pointer"
            >
              Stars
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSortBy('name'); setCurrentPage(1); }}
              className="rounded-full h-8 text-xs font-semibold px-4 cursor-pointer"
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'updated' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSortBy('updated'); setCurrentPage(1); }}
              className="rounded-full h-8 text-xs font-semibold px-4 cursor-pointer"
            >
              Updated
            </Button>
          </div>
        </div>

        {/* Row 2: Secondary Language Filters */}
        {availableLanguages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/20">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground mr-1 flex-shrink-0" />
            <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider">Language:</span>
            
            <button
              onClick={() => { setSelectedLanguage(null); setCurrentPage(1); }}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                selectedLanguage === null 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold' 
                  : 'bg-transparent border-border/30 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {availableLanguages.map(lang => (
              <button
                key={lang}
                onClick={() => { setSelectedLanguage(selectedLanguage === lang ? null : lang); setCurrentPage(1); }}
                className={`text-xs px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                  selectedLanguage === lang 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold' 
                    : 'bg-transparent border-border/30 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: LANGUAGE_COLORS[lang] || '#8b949e' }}
                />
                {lang}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* 2. Grid displaying paginated repositories */}
      <motion.div 
        layout="position"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {paginatedRepos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3"
            >
              <AlertCircle className="w-10 h-10 text-muted-foreground/60" />
              <p className="font-bold text-foreground text-lg">No repositories match filters</p>
              <p className="text-xs leading-relaxed max-w-sm">
                Try modifying your keyword search terms, clearing the active language filter, or looking up a different developer profile.
              </p>
              {(selectedLanguage || searchQuery) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setSelectedLanguage(null); setSearchQuery(''); }}
                  className="rounded-full mt-2"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            paginatedRepos.map((repo: GitHubRepo) => {
              const isExpanded = expandedRepoId === repo.id;
              return (
                <motion.div
                  layout
                  key={repo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-5 rounded-2xl border bg-card/40 hover:bg-secondary/10 hover:border-indigo-500/20 shadow-sm flex flex-col transition-all cursor-pointer group ${
                    isExpanded ? 'border-indigo-500/30 bg-secondary/10 shadow-md md:col-span-full' : 'border-border/30'
                  }`}
                  onClick={() => toggleExpand(repo.id)}
                >
                  <div className="flex flex-col h-full">
                    
                    {/* Repository details header */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-2.5 truncate max-w-[85%]">
                        <BookOpen className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <h4 className="text-sm font-extrabold text-foreground group-hover:text-indigo-400 transition-colors truncate">
                          {repo.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}
                      </div>
                    </div>

                    {/* Repository description */}
                    <p className={`text-xs text-muted-foreground mt-2 leading-relaxed h-8 ${isExpanded ? 'line-clamp-none h-auto' : 'line-clamp-2'}`}>
                      {repo.description || "No description provided for this repository."}
                    </p>

                    {/* Simple details row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/10 mt-4">
                      {repo.language ? (
                        <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-0.5 rounded-full border border-border/20 text-foreground/80 font-medium">
                          <span 
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }}
                          />
                          <span>{repo.language}</span>
                        </div>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/5" />
                          <strong className="text-foreground">{repo.stargazers_count}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                          <strong className="text-foreground">{repo.forks_count}</strong>
                        </span>
                        
                        <span className="hidden sm:flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Updated {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                      </div>
                    </div>

                    {/* 3. Click-to-Expand disclosure drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-border/20 space-y-4"
                          onClick={(e) => e.stopPropagation()} // Stop toggle clicks inside the expanded block
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/10">
                              <span className="text-muted-foreground block mb-0.5">Watchers</span>
                              <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4 text-indigo-400" />
                                <span className="font-extrabold text-foreground">{repo.watchers_count}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/10">
                              <span className="text-muted-foreground block mb-0.5">Open Issues</span>
                              <div className="flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-rose-400" />
                                <span className="font-extrabold text-foreground">{repo.open_issues_count}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded-xl border border-border/10 col-span-2">
                              <span className="text-muted-foreground block mb-0.5">Latest Commit Timeline</span>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                <span className="font-semibold text-foreground">
                                  {new Date(repo.updated_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Render repository topics/tags */}
                          {repo.topics && repo.topics.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Topics & Keywords</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {repo.topics.map(topic => (
                                  <span 
                                    key={topic} 
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Call to Actions */}
                          <div className="flex justify-end pt-2">
                            <Button 
                              size="sm" 
                              className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-8 px-4 cursor-pointer"
                              asChild
                            >
                              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Workspace on GitHub
                              </a>
                            </Button>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. Elegant Pagination Control Row */}
      {processedRepos.length > ITEMS_PER_PAGE && (
        <motion.div 
          layout="position"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/20 no-print"
        >
          <span className="text-xs font-semibold text-muted-foreground">
            Showing <strong className="text-foreground">{(activePage - 1) * ITEMS_PER_PAGE + 1}</strong> to{' '}
            <strong className="text-foreground">
              {Math.min(activePage * ITEMS_PER_PAGE, processedRepos.length)}
            </strong>{' '}
            of <strong className="text-foreground">{processedRepos.length}</strong> workspaces
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={activePage === 1}
              onClick={() => handlePageChange(activePage - 1)}
              className="rounded-full h-8 w-8 p-0 cursor-pointer border-border/40 disabled:opacity-40"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Show pages surrounding active index to prevent pagination explosion on large profiles
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - activePage) <= 1
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={activePage === pageNum ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded-full h-8 w-8 p-0 text-xs font-bold cursor-pointer ${
                      activePage === pageNum ? 'bg-indigo-600 text-white' : 'border-border/40 hover:bg-secondary/40'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              }
              if (
                (pageNum === 2 && activePage > 3) ||
                (pageNum === totalPages - 1 && activePage < totalPages - 2)
              ) {
                return (
                  <span key={pageNum} className="text-xs text-muted-foreground px-1 select-none font-bold">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={activePage === totalPages}
              onClick={() => handlePageChange(activePage + 1)}
              className="rounded-full h-8 w-8 p-0 cursor-pointer border-border/40 disabled:opacity-40"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
