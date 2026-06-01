import React from 'react';
import SearchHero from './features/github-profile/components/SearchHero';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <SearchHero />
      </main>
    </div>
  );
}

export default App;
