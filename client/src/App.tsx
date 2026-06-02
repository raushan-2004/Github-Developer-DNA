import { useState, useEffect } from 'react';
import SearchHero from './features/github-profile/components/SearchHero';
import Dashboard from './features/github-profile/components/Dashboard';
// Import the BattleMode component to compare two developers side-by-side
import BattleMode from './features/github-profile/components/BattleMode';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [battleUsernames, setBattleUsernames] = useState<[string, string] | null>(null);
  
  // Set default theme to dark for premium look!
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // 1. Initial mounting effects: parse share links from query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const battleParam = params.get('battle');
    
    if (userParam) {
      setActiveUsername(userParam);
    } else if (battleParam) {
      const parts = battleParam.split(',');
      if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
        setBattleUsernames([parts[0].trim(), parts[1].trim()]);
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
            {/* Theme Toggle located at top right on searching homepage */}
            <div className="absolute -top-16 right-4 sm:right-0">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors cursor-pointer shadow-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
            
            <SearchHero onSelect={setActiveUsername} onBattle={(u1, u2) => setBattleUsernames([u1, u2])} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
