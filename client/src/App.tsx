import { useState, useEffect } from 'react';
import SearchHero from './features/github-profile/components/SearchHero';
import Dashboard from './features/github-profile/components/Dashboard';
// Import the BattleMode component to compare two developers side-by-side
import BattleMode from './features/github-profile/components/BattleMode';
import { Sun, Moon, Server, Loader2, CheckCircle2, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

function App() {
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [battleUsernames, setBattleUsernames] = useState<[string, string] | null>(null);
  
  // Set default theme to dark for premium look!
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  const [isServerChecking, setIsServerChecking] = useState<boolean>(true);
  const [isServerAwake, setIsServerAwake] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Render Server Ping Cold Start Handler
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const healthUrl = apiBase.endsWith('/api') ? apiBase.slice(0, -4) + '/health' : apiBase + '/health';

    let intervalId: any;
    let timerId: any;

    // Start timer to count seconds
    timerId = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    const checkServerHealth = async () => {
      try {
        const response = await fetch(healthUrl);
        if (response.ok) {
          setIsServerAwake(true);
          // Wait a brief moment to show checkmark before dismissing loader overlay
          setTimeout(() => {
            setIsServerChecking(false);
            clearInterval(timerId);
          }, 1200);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.log("Render backend cold start: server is waking up...");
      }
    };

    checkServerHealth();
    intervalId = setInterval(checkServerHealth, 3000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timerId);
    };
  }, []);

  // 1. Initial mounting effects: parse share links from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const battleParam = params.get('battle');
    
    if (userParam) {
      const parsed = extractUsername(userParam);
      if (parsed) setActiveUsername(parsed);
    } else if (battleParam) {
      const parts = battleParam.split(',');
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        const u1 = extractUsername(parts[0]);
        const u2 = extractUsername(parts[1]);
        if (u1 && u2) setBattleUsernames([u1, u2]);
      }
    }
  }, []);

  // 2. Synchronize URL bar state with the application view
  useEffect(() => {
    if (activeUsername) {
      window.history.replaceState({}, '', `?user=${encodeURIComponent(activeUsername)}`);
    } else if (battleUsernames) {
      window.history.replaceState({}, '', `?battle=${encodeURIComponent(battleUsernames[0])},${encodeURIComponent(battleUsernames[1])}`);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [activeUsername, battleUsernames]);

  // 3. Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Dark Mode: Alt + T or Ctrl + D
      if ((e.altKey && e.key.toLowerCase() === 't') || (e.ctrlKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        toggleDarkMode();
      }
      
      // Go Back / Escape Arena: Escape
      if (e.key === 'Escape') {
        if (activeUsername) {
          e.preventDefault();
          setActiveUsername(null);
        } else if (battleUsernames) {
          e.preventDefault();
          setBattleUsernames(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUsername, battleUsernames]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Render Cold-Start Wakeup Loading Overlay */}
      <AnimatePresence>
        {isServerChecking && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl px-4 text-center select-none"
          >
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none dark:bg-indigo-500/5 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none dark:bg-purple-500/5 animate-pulse" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
              className="max-w-md w-full bg-card/40 border border-border/30 backdrop-blur-md p-8 rounded-3xl shadow-2xl relative overflow-hidden bg-grid-pattern"
            >
              <div className="absolute -inset-px rounded-3xl border border-indigo-500/15 pointer-events-none" />
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 relative">
                  {!isServerAwake ? (
                    <>
                      <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-background animate-ping" />
                    </>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-foreground font-display mb-2">
                {!isServerAwake ? 'Waking Up Developer DNA Engine' : 'Engine Ready!'}
              </h2>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
                {!isServerAwake 
                  ? "Our free-tier Render backend spins down after 15 minutes of inactivity. Pinging our services... (normally takes 30-50 seconds)." 
                  : "Authentication and database handshake complete. Ready to analyze code workspaces."}
              </p>

              {/* Status Pill & Timer */}
              <div className="flex items-center justify-center gap-3 bg-secondary/50 border border-border/20 px-4 py-2.5 rounded-2xl max-w-[240px] mx-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {!isServerAwake ? (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                      <span>Pinging ({elapsedTime}s)</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Connected</span>
                    </>
                  )}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Toggle located at top right of the entire page on the home search page */}
      {!activeUsername && !battleUsernames && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full border border-border/50 bg-secondary/30 hover:bg-secondary/60 backdrop-blur-md transition-colors cursor-pointer shadow-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 transform"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      )}

      {/* 3D Glass Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none dark:bg-indigo-500/5 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none dark:bg-purple-500/5 animate-pulse" style={{ animationDuration: '10s' }} />

      <main className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start min-h-screen ${(!activeUsername && !battleUsernames) ? 'items-center justify-center' : ''}`}>
        {activeUsername ? (
          <Dashboard 
            username={activeUsername} 
            onBack={() => setActiveUsername(null)} 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : battleUsernames ? (
          <BattleMode 
            username1={battleUsernames[0]}
            username2={battleUsernames[1]}
            onBack={() => setBattleUsernames(null)}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : (
          <div className="relative w-full max-w-3xl flex flex-col items-center">
            <SearchHero onSelect={setActiveUsername} onBattle={(u1, u2) => setBattleUsernames([u1, u2])} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
