import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Swords, Trophy, Star, GitFork, Users, BookOpen } from 'lucide-react';
import { useGithubUser, useGithubRepos, useGithubStats } from '../api/queries';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BattleModeProps {
  username1: string;
  username2: string;
  onBack: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SCORE_WEIGHTS = {
  stars: 2,
  forks: 3,
  repos: 5,
  followers: 1
};

export default function BattleMode({ username1, username2, onBack }: BattleModeProps) {
  // Player 1 Data
  const { data: user1, isLoading: user1Loading, isError: user1Error } = useGithubUser(username1);
  const { isLoading: repos1Loading } = useGithubRepos(username1);
  const { data: stats1, isLoading: stats1Loading } = useGithubStats(username1);

  // Player 2 Data
  const { data: user2, isLoading: user2Loading, isError: user2Error } = useGithubUser(username2);
  const { isLoading: repos2Loading } = useGithubRepos(username2);
  const { data: stats2, isLoading: stats2Loading } = useGithubStats(username2);

  const isLoading = user1Loading || repos1Loading || stats1Loading || user2Loading || repos2Loading || stats2Loading;
  const isError = user1Error || user2Error;

  // Calculate Scores
  const p1Score = useMemo(() => {
    if (!user1 || !stats1) return 0;
    return (
      (stats1.totalStars || 0) * SCORE_WEIGHTS.stars +
      (stats1.totalForks || 0) * SCORE_WEIGHTS.forks +
      (user1.public_repos || 0) * SCORE_WEIGHTS.repos +
      (user1.followers || 0) * SCORE_WEIGHTS.followers
    );
  }, [user1, stats1]);

  const p2Score = useMemo(() => {
    if (!user2 || !stats2) return 0;
    return (
      (stats2.totalStars || 0) * SCORE_WEIGHTS.stars +
      (stats2.totalForks || 0) * SCORE_WEIGHTS.forks +
      (user2.public_repos || 0) * SCORE_WEIGHTS.repos +
      (user2.followers || 0) * SCORE_WEIGHTS.followers
    );
  }, [user2, stats2]);

  const chartData = useMemo(() => {
    if (!user1 || !stats1 || !user2 || !stats2) return [];
    return [
      {
        metric: 'Stars',
        [user1.login]: stats1.totalStars,
        [user2.login]: stats2.totalStars,
      },
      {
        metric: 'Forks',
        [user1.login]: stats1.totalForks,
        [user2.login]: stats2.totalForks,
      },
      {
        metric: 'Followers',
        [user1.login]: user1.followers,
        [user2.login]: user2.followers,
      },
      {
        metric: 'Repos',
        [user1.login]: user1.public_repos,
        [user2.login]: user2.public_repos,
      }
    ];
  }, [user1, stats1, user2, stats2]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-10 flex flex-col items-center">
        <div className="flex gap-4 justify-between w-full mb-10">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center">
          <Skeleton className="h-[400px] w-full max-w-sm rounded-2xl" />
          <div className="font-black text-4xl italic text-muted-foreground mx-4">VS</div>
          <Skeleton className="h-[400px] w-full max-w-sm rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !user1 || !user2 || !stats1 || !stats2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-4">
          <Swords className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold">Battle Aborted</h2>
        <p className="text-muted-foreground mt-2">Could not load profiles for one or both challengers.</p>
        <Button variant="outline" onClick={onBack} className="mt-6 rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Arena
        </Button>
      </div>
    );
  }

  const winner = p1Score > p2Score ? 1 : p2Score > p1Score ? 2 : 0; // 0 for tie

  const PlayerCard = ({ user, stats, score, isWinner, isP1 }: any) => {
    const accentColor = isP1 ? 'from-cyan-500 to-blue-600' : 'from-rose-500 to-orange-600';
    const glowColor = isP1 ? 'shadow-cyan-500/20' : 'shadow-rose-500/20';
    const borderColor = isP1 ? 'border-cyan-500/30' : 'border-rose-500/30';
    
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, x: isP1 ? -50 : 50 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        className={`relative flex flex-col items-center p-8 rounded-3xl border-2 ${isWinner ? borderColor + ' shadow-2xl ' + glowColor : 'border-border/40 bg-card/40'} backdrop-blur-md w-full max-w-sm overflow-hidden group`}
      >
        {isWinner && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5 pointer-events-none" />
        )}
        
        {isWinner && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 inset-x-0 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-center font-black uppercase tracking-widest text-sm shadow-md"
          >
            Winner
          </motion.div>
        )}

        <div className="relative mt-4">
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${accentColor} opacity-70 blur-md ${isWinner ? 'animate-pulse' : 'opacity-30'} transition-opacity`} />
          <img src={user.avatar_url} alt={user.login} className="relative w-32 h-32 rounded-full border-4 border-background object-cover" />
        </div>

        <h3 className="text-2xl font-extrabold mt-4 text-center text-foreground">{user.name || user.login}</h3>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors mb-6">@{user.login}</a>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
            <span className="flex items-center text-sm font-semibold text-muted-foreground"><Star className="w-4 h-4 mr-2 text-amber-400"/> Stars</span>
            <span className="font-bold text-foreground text-lg">{stats.totalStars}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
            <span className="flex items-center text-sm font-semibold text-muted-foreground"><GitFork className="w-4 h-4 mr-2 text-emerald-400"/> Forks</span>
            <span className="font-bold text-foreground text-lg">{stats.totalForks}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
            <span className="flex items-center text-sm font-semibold text-muted-foreground"><BookOpen className="w-4 h-4 mr-2 text-indigo-400"/> Repos</span>
            <span className="font-bold text-foreground text-lg">{user.public_repos}</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
            <span className="flex items-center text-sm font-semibold text-muted-foreground"><Users className="w-4 h-4 mr-2 text-rose-400"/> Followers</span>
            <span className="font-bold text-foreground text-lg">{user.followers}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 w-full text-center">
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-1">Battle Power</p>
          <p className={`text-5xl font-black bg-gradient-to-r ${accentColor} bg-clip-text text-transparent drop-shadow-sm`}>
            {score.toLocaleString()}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full min-h-screen py-4 flex flex-col relative space-y-12">
      {/* Background Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="rounded-full hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Escape Arena
        </Button>
        <div className="flex items-center text-xl font-black uppercase tracking-widest text-foreground">
          <Swords className="w-6 h-6 mr-3 text-red-500 animate-pulse" />
          Developer Battle
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-6xl mx-auto">
        {/* Player 1 */}
        <PlayerCard user={user1} stats={stats1} score={p1Score} isWinner={winner === 1} isP1={true} />

        {/* VS Badge */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, delay: 0.5 }}
          className="flex flex-col items-center z-10"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-foreground/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-rose-500/20" />
            <span className="text-3xl md:text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">VS</span>
          </div>
          {winner === 0 && (
            <span className="mt-4 font-bold text-yellow-500 tracking-widest uppercase">Draw!</span>
          )}
        </motion.div>

        {/* Player 2 */}
        <PlayerCard user={user2} stats={stats2} score={p2Score} isWinner={winner === 2} isP1={false} />
      </div>

      {/* Head-to-Head Analytics Chart */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-4xl mx-auto mt-16 p-8 rounded-3xl bg-card/30 backdrop-blur-md border border-border/40 shadow-xl"
      >
        <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Head-to-Head Metrics
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
              <XAxis dataKey="metric" tick={{ fill: 'currentColor', fontSize: 14, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey={user1.login} fill="#0ea5e9" name={`@${user1.login}`} radius={[4, 4, 0, 0]} animationDuration={1500} />
              <Bar dataKey={user2.login} fill="#f43f5e" name={`@${user2.login}`} radius={[4, 4, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
    </div>
  );
}
