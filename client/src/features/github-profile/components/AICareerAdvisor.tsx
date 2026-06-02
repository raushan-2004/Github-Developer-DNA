import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Cpu, FileText, AlertCircle } from 'lucide-react';
import { useAiReview } from '../api/queries';

interface AICareerAdvisorProps {
  profileData: any;
}

export default function AICareerAdvisor({ profileData }: AICareerAdvisorProps) {
  const { mutate: generateReview, data: review, isPending: isLoading, isError, error, reset } = useAiReview();

  const handleGenerate = () => {
    generateReview(profileData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-md shadow-md relative overflow-hidden group w-full">
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Bot className="w-6 h-6 text-indigo-400" />
          AI Career Advisor
        </CardTitle>
        <CardDescription className="text-base">
          Get a personalized career review powered by Gemini AI, analyzing your repositories, languages, and open source impact.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!review && !isLoading && !isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">Ready to analyze your DNA?</h3>
            <p className="text-muted-foreground max-w-md">
              Our AI engine will process your Github activity to provide actionable career advice, strengths, and resume recommendations.
            </p>
            <Button 
              onClick={handleGenerate} 
              className="mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg border-0"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Career Review
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 justify-center py-8">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold animate-pulse text-indigo-400">Gemini AI is analyzing your profile...</h3>
                <p className="text-sm text-muted-foreground">Synthesizing insights and mapping career trajectories.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full text-destructive">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-destructive">Analysis Failed</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                {(error as any)?.response?.data?.message || error.message || 'An unexpected error occurred while generating the review.'}
              </p>
            </div>
            <Button variant="outline" onClick={reset} className="mt-2 rounded-full">
              Try Again
            </Button>
          </div>
        )}

        {review && !isLoading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Summary */}
            <motion.div variants={itemVariants} className="bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-indigo-400">
                <TrendingUp className="w-5 h-5" /> Career Summary
              </h3>
              <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                {review.careerSummary}
              </p>
            </motion.div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" /> Key Strengths
                </h3>
                <ul className="space-y-2">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 bg-secondary/30 p-3 rounded-lg border border-border/40 text-sm">
                      <div className="min-w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/80">{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="w-5 h-5" /> Areas for Growth
                </h3>
                <ul className="space-y-2">
                  {review.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 bg-secondary/30 p-3 rounded-lg border border-border/40 text-sm">
                      <div className="min-w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/80">{w}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Career Path & Technologies */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-md font-semibold flex items-center gap-2 text-sky-400">
                  <Cpu className="w-4 h-4" /> Suggested Tech
                </h3>
                <div className="flex flex-wrap gap-2">
                  {review.suggestedTechnologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-md font-semibold flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-4 h-4" /> Recommended Career Path
                </h3>
                <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl">
                  <p className="text-foreground/90 font-medium">{review.suggestedCareerPath}</p>
                </div>
              </div>
            </motion.div>

            {/* Resume Recommendations */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-400">
                <FileText className="w-5 h-5" /> Resume Action Items
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {review.resumeRecommendations.map((rec, i) => (
                  <div key={i} className="bg-secondary/40 p-4 rounded-xl border border-border/50 flex items-start gap-3">
                    <span className="text-blue-400 font-bold bg-blue-500/10 rounded-md w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/80 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        )}
      </CardContent>
      
      {review && !isLoading && (
        <CardFooter className="bg-secondary/20 border-t border-border/30 px-6 py-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Powered by Gemini
          </p>
          <Button variant="outline" size="sm" onClick={reset} className="rounded-full">
            Reset Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
