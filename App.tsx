/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Play, 
  Newspaper, 
  Star, 
  Settings, 
  ChevronRight, 
  Search, 
  Bell,
  Home,
  Plus,
  MoreVertical,
  ArrowLeft,
  Share2,
  Heart,
  Trash2,
  Edit2,
  Save,
  X,
  Lock
} from 'lucide-react';
import { Player, Match, Highlight, NewsItem, Story } from './types';
import { PLAYERS, MATCHES, HIGHLIGHTS, NEWS, STORIES, CAROUSEL_IMAGES } from './constants';

// --- Components ---

const Logo = ({ className = "w-24 h-24", onLongPress }: { className?: string, onLongPress?: () => void }) => {
  const timerRef = useRef<any>(null);

  const handleStart = () => {
    if (onLongPress) {
      timerRef.current = setTimeout(onLongPress, 3000);
    }
  };

  const handleEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div 
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
      <img 
        src="https://i.ibb.co/n87hhjzJ/20250205-031515.png" 
        alt="Young Star Andarwali" 
        className="w-full h-full object-contain relative z-10"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/cricket/200/200';
        }}
      />
    </div>
  );
};

const Button = ({ children, onClick, className = "", variant = "primary" }: any) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants: any = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-400/20",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
    outline: "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10",
    ghost: "text-zinc-400 hover:text-yellow-400"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

// --- Screens ---

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'welcome' | 'dashboard' | 'matches' | 'squad' | 'highlights' | 'news' | 'favorite-xi' | 'settings' | 'admin-pin' | 'admin-panel'>('splash');
  const [favoriteXI, setFavoriteXI] = useState<Player[]>([]);
  
  // Persistence State
  const [players, setPlayers] = useState<Player[]>(() => JSON.parse(localStorage.getItem('ys_players') || '[]'));
  const [matches, setMatches] = useState<Match[]>(() => JSON.parse(localStorage.getItem('ys_matches') || '[]'));
  const [highlights, setHighlights] = useState<Highlight[]>(() => JSON.parse(localStorage.getItem('ys_highlights') || '[]'));
  const [news, setNews] = useState<NewsItem[]>(() => JSON.parse(localStorage.getItem('ys_news') || '[]'));
  const [stories, setStories] = useState<Story[]>(() => JSON.parse(localStorage.getItem('ys_stories') || '[]'));
  const [carouselImages, setCarouselImages] = useState<string[]>(() => JSON.parse(localStorage.getItem('ys_carousel') || '[]'));

  useEffect(() => {
    localStorage.setItem('ys_players', JSON.stringify(players));
    localStorage.setItem('ys_matches', JSON.stringify(matches));
    localStorage.setItem('ys_highlights', JSON.stringify(highlights));
    localStorage.setItem('ys_news', JSON.stringify(news));
    localStorage.setItem('ys_stories', JSON.stringify(stories));
    localStorage.setItem('ys_carousel', JSON.stringify(carouselImages));
  }, [players, matches, highlights, news, stories, carouselImages]);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => setScreen('welcome'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const toggleFavorite = (player: Player) => {
    if (favoriteXI.find(p => p.id === player.id)) {
      setFavoriteXI(favoriteXI.filter(p => p.id !== player.id));
    } else if (favoriteXI.length < 11) {
      setFavoriteXI([...favoriteXI, player]);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen />;
      case 'welcome': return <WelcomeScreen onStart={() => setScreen('dashboard')} />;
      case 'dashboard': return <Dashboard setScreen={setScreen} players={players} matches={matches} stories={stories} carouselImages={carouselImages} />;
      case 'matches': return <MatchesScreen setScreen={setScreen} matches={matches} />;
      case 'squad': return <SquadScreen setScreen={setScreen} toggleFavorite={toggleFavorite} favoriteXI={favoriteXI} players={players} />;
      case 'highlights': return <HighlightsScreen setScreen={setScreen} highlights={highlights} />;
      case 'news': return <NewsScreen setScreen={setScreen} news={news} />;
      case 'favorite-xi': return <FavoriteXIScreen setScreen={setScreen} favoriteXI={favoriteXI} />;
      case 'settings': return <SettingsScreen setScreen={setScreen} onAdminPress={() => setScreen('admin-pin')} />;
      case 'admin-pin': return <AdminPinScreen onUnlock={() => setScreen('admin-panel')} onCancel={() => setScreen('dashboard')} />;
      case 'admin-panel': return (
        <AdminPanel 
          setScreen={setScreen}
          players={players} setPlayers={setPlayers}
          matches={matches} setMatches={setMatches}
          highlights={highlights} setHighlights={setHighlights}
          news={news} setNews={setNews}
          stories={stories} setStories={setStories}
          carouselImages={carouselImages} setCarouselImages={setCarouselImages}
        />
      );
      default: return <Dashboard setScreen={setScreen} players={players} matches={matches} stories={stories} carouselImages={carouselImages} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto min-h-screen relative overflow-hidden"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Screen Implementations ---

function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-zinc-900 to-black">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Logo className="w-48 h-48" />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h1 className="text-3xl font-black tracking-tighter text-yellow-400 uppercase">Young Star</h1>
        <p className="text-zinc-500 font-medium tracking-widest uppercase text-sm">Andarwali Cricket Club</p>
      </motion.div>
      <div className="absolute bottom-12">
        <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-yellow-400"
          />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col min-h-screen p-8 bg-black relative">
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80" 
          alt="Cricket Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>
      
      <div className="mt-auto relative z-10">
        <Logo className="w-20 h-20 mb-6" />
        <h2 className="text-5xl font-black tracking-tighter leading-none mb-4">
          MANAGE YOUR <br />
          <span className="text-yellow-400">CRICKET TEAM</span> <br />
          LIKE A PRO
        </h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-xs">
          The ultimate management tool for Young Star Andarwali. Track stats, matches, and build your dream team.
        </p>
        <Button onClick={onStart} className="w-full py-4 text-lg">
          GET STARTED <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}

function Dashboard({ setScreen, players, matches, stories, carouselImages }: { setScreen: (s: any) => void, players: Player[], matches: Match[], stories: Story[], carouselImages: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselImages.length === 0) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages]);

  const topBatsmen = [...players].sort((a, b) => (b.stats.runs || 0) - (a.stats.runs || 0)).slice(0, 3);
  const topBowlers = [...players].sort((a, b) => (b.stats.wickets || 0) - (a.stats.wickets || 0)).slice(0, 3);
  const mostSixes = [...players].sort((a, b) => (b.stats.sixes || 0) - (a.stats.sixes || 0))[0];
  const mostWickets = [...players].sort((a, b) => (b.stats.wickets || 0) - (a.stats.wickets || 0))[0];

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" onLongPress={() => setScreen('admin-pin')} />
          <div>
            <h1 className="font-black text-lg leading-none">YOUNG STAR</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-yellow-400">
            <Search size={20} />
          </button>
          <button className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-yellow-400 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Stories */}
      <section className="px-6 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-bold text-zinc-500">Add Story</span>
          </div>
          {stories.map(story => (
            <div key={story.id} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-yellow-600">
                <img src={story.userImage} alt={story.userName} className="w-full h-full rounded-full object-cover border-2 border-black" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[10px] font-bold text-zinc-300">{story.userName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Auto Scrolling Carousel */}
      {carouselImages.length > 0 && (
        <section className="px-6 mb-8">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl"
          >
            {carouselImages.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-full aspect-video snap-center relative">
                <img src={img} alt={`Slide ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded mb-2 inline-block">FEATURED</span>
                  <h3 className="text-xl font-black leading-tight">MATCH DAY VIBES</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Stats */}
      {players.length > 0 && (
        <section className="px-6 mb-8 grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center text-center">
            <Trophy className="text-yellow-400 mb-2" size={24} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Most Sixes</span>
            <p className="font-black text-lg">{mostSixes?.name || '-'}</p>
            <p className="text-yellow-400 font-bold text-sm">{mostSixes?.stats.sixes || 0} Sixes</p>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <Star className="text-yellow-400 mb-2" size={24} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Most Wickets</span>
            <p className="font-black text-lg">{mostWickets?.name || '-'}</p>
            <p className="text-yellow-400 font-bold text-sm">{mostWickets?.stats.wickets || 0} Wickets</p>
          </Card>
        </section>
      )}

      {/* Top Players */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-xl tracking-tighter">TOP PERFORMERS</h3>
          <button onClick={() => setScreen('squad')} className="text-yellow-400 text-xs font-bold">VIEW ALL</button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-zinc-900/30 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div> Top 3 Batsmen
            </div>
            <div className="space-y-3">
              {topBatsmen.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-700 font-black text-xl">0{i+1}</span>
                    <div className="relative">
                      <img src={p.image} className="w-10 h-10 rounded-full object-cover brightness-110 contrast-110 saturate-110 border border-zinc-800" alt={p.name} referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-[10px] text-zinc-500">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-yellow-400">{p.stats.runs}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Runs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/30 rounded-2xl p-4">
            <div className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div> Top 3 Bowlers
            </div>
            <div className="space-y-3">
              {topBowlers.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-700 font-black text-xl">0{i+1}</span>
                    <div className="relative">
                      <img src={p.image} className="w-10 h-10 rounded-full object-cover brightness-110 contrast-110 saturate-110 border border-zinc-800" alt={p.name} referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"></div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-[10px] text-zinc-500">{p.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-yellow-400">{p.stats.wickets}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Wickets</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/90 backdrop-blur-lg border-t border-zinc-800 px-6 py-4 flex justify-between items-center z-50">
        <NavButton icon={<Home size={24} />} active label="Home" onClick={() => setScreen('dashboard')} />
        <NavButton icon={<Calendar size={24} />} label="Matches" onClick={() => setScreen('matches')} />
        <NavButton icon={<Users size={24} />} label="Squad" onClick={() => setScreen('squad')} />
        <NavButton icon={<Play size={24} />} label="Highlights" onClick={() => setScreen('highlights')} />
        <NavButton icon={<Settings size={24} />} label="Settings" onClick={() => setScreen('settings')} />
      </nav>
    </div>
  );
}

function NavButton({ icon, active, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-yellow-400' : 'text-zinc-600 hover:text-zinc-400'}`}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function MatchesScreen({ setScreen, matches }: { setScreen: (s: any) => void, matches: Match[] }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="MATCHES" onBack={() => setScreen('dashboard')} />
      <div className="p-6 space-y-6">
        {matches.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold">No matches scheduled yet.</div>
        )}
        {matches.map(match => (
          <Card key={match.id} className="relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-black px-2 py-1 rounded ${
                match.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 
                match.status === 'Upcoming' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {match.status.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-zinc-500">{match.date} • {match.time}</span>
            </div>
            
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <Logo className="w-12 h-12" />
                <span className="font-black text-xs text-center">YOUNG STAR</span>
              </div>
              <div className="text-zinc-700 font-black text-2xl italic">VS</div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <img src={match.opponentLogo} className="w-12 h-12 rounded-full bg-zinc-800" alt={match.opponent} referrerPolicy="no-referrer" />
                <span className="font-black text-xs text-center uppercase">{match.opponent}</span>
              </div>
            </div>

            {match.score && (
              <div className="text-center mb-4">
                <p className="text-2xl font-black text-yellow-400 tracking-tighter">{match.score}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500">
              <Calendar size={12} /> {match.venue}
            </div>

            {match.result && (
              <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                <p className="text-yellow-400 font-black text-sm">{match.result}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function SquadScreen({ setScreen, toggleFavorite, favoriteXI, players }: { setScreen: (s: any) => void, toggleFavorite: (p: Player) => void, favoriteXI: Player[], players: Player[] }) {
  const [filter, setFilter] = useState<string>('All');
  const roles = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];

  const filteredPlayers = filter === 'All' ? players : players.filter(p => p.role === filter);

  return (
    <div className="pb-24">
      <ScreenHeader title="SQUAD" onBack={() => setScreen('dashboard')} />
      
      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filter === role ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-500'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-20 text-zinc-600 font-bold">No players in squad yet.</div>
      )}

      <div className="p-6 grid grid-cols-2 gap-4">
        {filteredPlayers.map(player => (
          <Card key={player.id} className="p-0 overflow-hidden group">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={player.image} 
                className="w-full h-full object-cover brightness-105 contrast-110 saturate-110 group-hover:scale-110 transition-all duration-700 ease-out" 
                alt={player.name} 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
              <button 
                onClick={() => toggleFavorite(player)}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-colors ${
                  favoriteXI.find(p => p.id === player.id) ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white'
                }`}
              >
                <Heart size={16} fill={favoriteXI.find(p => p.id === player.id) ? 'currentColor' : 'none'} />
              </button>
              <div className="absolute bottom-3 left-3">
                <p className="font-black text-sm leading-none mb-1">{player.name.toUpperCase()}</p>
                <p className="text-yellow-400 text-[10px] font-bold uppercase">{player.role}</p>
              </div>
            </div>
            <div className="p-3 grid grid-cols-4 gap-1 bg-zinc-900">
              <div className="text-center">
                <p className="text-[8px] text-zinc-500 font-bold">RUNS</p>
                <p className="font-black text-[10px]">{player.stats.runs || '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-zinc-500 font-bold">WKTS</p>
                <p className="font-black text-[10px]">{player.stats.wickets || '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-zinc-500 font-bold">AVG</p>
                <p className="font-black text-[10px]">{player.stats.average || '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-[8px] text-zinc-500 font-bold">S/R</p>
                <p className="font-black text-[10px]">{player.stats.strikeRate || '-'}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-24 right-6">
        <button 
          onClick={() => setScreen('favorite-xi')}
          className="bg-yellow-400 text-black p-4 rounded-full shadow-2xl shadow-yellow-400/40 flex items-center gap-2 font-black text-sm"
        >
          <Star size={20} /> MY XI ({favoriteXI.length})
        </button>
      </div>
    </div>
  );
}

function HighlightsScreen({ setScreen, highlights }: { setScreen: (s: any) => void, highlights: Highlight[] }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="HIGHLIGHTS" onBack={() => setScreen('dashboard')} />
      <div className="p-6 space-y-6">
        {highlights.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold">No highlights available yet.</div>
        )}
        {highlights.map(item => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
              <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-[10px] font-bold">
                {item.duration}
              </div>
            </div>
            <h3 className="font-black text-lg leading-tight mb-1 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
            <p className="text-zinc-500 text-xs font-bold">{item.date} • Cricket Highlights</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsScreen({ setScreen, news }: { setScreen: (s: any) => void, news: NewsItem[] }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="LATEST NEWS" onBack={() => setScreen('dashboard')} />
      <div className="p-6 space-y-8">
        {news.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-bold">No news updates yet.</div>
        )}
        {news.map(item => (
          <div key={item.id} className="flex flex-col gap-4">
            <img src={item.image} className="w-full aspect-[16/10] object-cover rounded-2xl" alt={item.title} referrerPolicy="no-referrer" />
            <div>
              <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-2 inline-block">TEAM UPDATE</span>
              <h3 className="text-2xl font-black leading-tight mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{item.summary}</p>
              <div className="flex items-center justify-between">
                <p className="text-zinc-600 text-[10px] font-bold">{item.date}</p>
                <button className="text-yellow-400 text-xs font-black flex items-center gap-1">READ MORE <ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoriteXIScreen({ setScreen, favoriteXI }: { setScreen: (s: any) => void, favoriteXI: Player[] }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="FAVORITE XI" onBack={() => setScreen('squad')} />
      
      <div className="p-6">
        <div className="relative aspect-[2/3] bg-zinc-900 rounded-3xl border-4 border-zinc-800 overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-l-2 border-r-2 border-white"></div>
          </div>
          
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex justify-center gap-4">
              {favoriteXI.slice(0, 2).map(p => <div key={p.id}><XIPlayer player={p} /></div>)}
            </div>
            <div className="flex justify-around">
              {favoriteXI.slice(2, 5).map(p => <div key={p.id}><XIPlayer player={p} /></div>)}
            </div>
            <div className="flex justify-around">
              {favoriteXI.slice(5, 8).map(p => <div key={p.id}><XIPlayer player={p} /></div>)}
            </div>
            <div className="flex justify-center gap-4">
              {favoriteXI.slice(8, 11).map(p => <div key={p.id}><XIPlayer player={p} /></div>)}
            </div>
          </div>

          {favoriteXI.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <Star size={48} className="text-zinc-800 mb-4" />
              <p className="text-zinc-600 font-bold">No players selected yet. Go to Squad to pick your Favorite XI.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-xl tracking-tighter">SELECTED SQUAD ({favoriteXI.length}/11)</h3>
          {favoriteXI.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={p.image} className="w-10 h-10 rounded-full object-cover brightness-110 contrast-110 saturate-110 border border-zinc-800" alt={p.name} />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]"></div>
                </div>
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">{p.role}</p>
                </div>
              </div>
              <Trophy size={16} className="text-yellow-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function XIPlayer({ player }: { player: Player }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-400 p-[2px] bg-black shadow-[0_0_15px_rgba(250,204,21,0.2)]">
          <img src={player.image} className="w-full h-full rounded-full object-cover brightness-110 contrast-110 saturate-110" alt={player.name} referrerPolicy="no-referrer" />
        </div>
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.4)]"></div>
      </div>
      <span className="text-[8px] font-black bg-yellow-400 text-black px-1.5 py-0.5 rounded shadow-lg truncate max-w-[50px] uppercase tracking-tighter">{player.name.split(' ')[0]}</span>
    </div>
  );
}

function SettingsScreen({ setScreen, onAdminPress }: { setScreen: (s: any) => void, onAdminPress: () => void }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="SETTINGS" onBack={() => setScreen('dashboard')} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-yellow-400 p-1">
            <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=200&h=200&fit=crop" className="w-full h-full rounded-xl object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h3 className="text-xl font-black">Rashid Khan</h3>
            <p className="text-zinc-500 text-sm font-bold">Team Manager</p>
            <button className="text-yellow-400 text-xs font-bold mt-1">Edit Profile</button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">Account</p>
          <SettingsItem icon={<Bell size={20} />} label="Notifications" />
          <SettingsItem icon={<Heart size={20} />} label="My Favorites" />
          <SettingsItem icon={<Calendar size={20} />} label="Match Reminders" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-zinc-500 uppercase px-2 mb-2">App Settings</p>
          <SettingsItem icon={<Play size={20} />} label="Video Quality" />
          <SettingsItem icon={<Share2 size={20} />} label="Share App" />
          <SettingsItem icon={<Star size={20} />} label="Rate Us" />
          <SettingsItem icon={<Lock size={20} />} label="Admin Access" onClick={onAdminPress} />
        </div>

        <Button variant="secondary" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20">
          LOGOUT
        </Button>

        <div className="text-center pt-8">
          <Logo className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-zinc-700 text-[10px] font-bold">VERSION 2.4.0 (BUILD 102)</p>
          <p className="text-zinc-800 text-[8px] font-bold mt-1">© 2026 YOUNG STAR ANDARWALI</p>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-zinc-400">{icon}</div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-zinc-700" />
    </button>
  );
}

function ScreenHeader({ title, onBack }: { title: string, onBack: () => void }) {
  return (
    <header className="p-6 flex items-center gap-4 sticky top-0 bg-black/80 backdrop-blur-md z-50">
      <button onClick={onBack} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-yellow-400">
        <ArrowLeft size={20} />
      </button>
      <h1 className="font-black text-xl tracking-tighter">{title}</h1>
    </header>
  );
}

function AdminPinScreen({ onUnlock, onCancel }: { onUnlock: () => void, onCancel: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePin = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin === '1036') {
        onUnlock();
      } else if (newPin.length === 4) {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black">
      <Logo className="w-24 h-24 mb-8" />
      <h2 className="text-2xl font-black mb-2">ADMIN ACCESS</h2>
      <p className="text-zinc-500 text-sm mb-8">Enter PIN to unlock control panel</p>
      
      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              error ? 'bg-red-500 border-red-500' : 
              pin.length > i ? 'bg-yellow-400 border-yellow-400' : 'border-zinc-800'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button 
            key={n} 
            onClick={() => handlePin(n.toString())}
            className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-bold active:bg-yellow-400 active:text-black transition-colors"
          >
            {n}
          </button>
        ))}
        <div />
        <button 
          onClick={() => handlePin('0')}
          className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-bold active:bg-yellow-400 active:text-black transition-colors"
        >
          0
        </button>
        <button onClick={onCancel} className="w-16 h-16 rounded-full flex items-center justify-center text-zinc-600 font-bold active:text-white">
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ 
  setScreen, 
  players, setPlayers, 
  matches, setMatches,
  highlights, setHighlights,
  news, setNews,
  stories, setStories,
  carouselImages, setCarouselImages
}: any) {
  const [tab, setTab] = useState<'players' | 'matches' | 'stories' | 'news' | 'carousel'>('players');
  const [editing, setEditing] = useState<any>(null);

  const save = (type: string, item: any) => {
    if (type === 'players') {
      if (item.id) setPlayers(players.map((p: any) => p.id === item.id ? item : p));
      else setPlayers([...players, { ...item, id: Date.now().toString() }]);
    } else if (type === 'matches') {
      if (item.id) setMatches(matches.map((m: any) => m.id === item.id ? item : m));
      else setMatches([...matches, { ...item, id: Date.now().toString() }]);
    } else if (type === 'stories') {
      if (item.id) setStories(stories.map((s: any) => s.id === item.id ? item : s));
      else setStories([...stories, { ...item, id: Date.now().toString() }]);
    } else if (type === 'news') {
      if (item.id) setNews(news.map((n: any) => n.id === item.id ? item : n));
      else setNews([...news, { ...item, id: Date.now().toString() }]);
    }
    setEditing(null);
  };

  const remove = (type: string, id: string) => {
    if (type === 'players') setPlayers(players.filter((p: any) => p.id !== id));
    if (type === 'matches') setMatches(matches.filter((m: any) => m.id !== id));
    if (type === 'stories') setStories(stories.filter((s: any) => s.id !== id));
    if (type === 'news') setNews(news.filter((n: any) => n.id !== id));
  };

  return (
    <div className="pb-24">
      <header className="p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <h1 className="font-black text-xl tracking-tighter">ADMIN PANEL</h1>
        </div>
        <button onClick={() => setScreen('dashboard')} className="p-2 bg-zinc-900 rounded-full text-zinc-400">
          <X size={20} />
        </button>
      </header>

      <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800">
        {['players', 'matches', 'stories', 'news', 'carousel'].map((t: any) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-colors ${
              tab === t ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'players' && (
          <div className="space-y-4">
            <Button onClick={() => setEditing({ name: '', role: 'Batsman', image: '', stats: { matches: 0, runs: 0, wickets: 0, sixes: 0, average: 0, strikeRate: 0 } })} className="w-full">
              <Plus size={20} /> ADD NEW PLAYER
            </Button>
            {players.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-10 h-10 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{p.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(p)} className="p-2 text-zinc-400 hover:text-yellow-400"><Edit2 size={18} /></button>
                  <button onClick={() => remove('players', p.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'matches' && (
          <div className="space-y-4">
            <Button onClick={() => setEditing({ opponent: '', opponentLogo: '', date: '', time: '', venue: '', status: 'Upcoming' })} className="w-full">
              <Plus size={20} /> CREATE MATCH
            </Button>
            {matches.map((m: any) => (
              <div key={m.id} className="bg-zinc-900 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-black">{m.opponent.toUpperCase()}</p>
                  <span className="text-[10px] bg-yellow-400 text-black px-2 py-1 rounded font-bold">{m.status}</span>
                </div>
                <p className="text-xs text-zinc-500">{m.date} • {m.time}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditing(m)} className="p-2 text-zinc-400 hover:text-yellow-400"><Edit2 size={18} /></button>
                  <button onClick={() => remove('matches', m.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'stories' && (
          <div className="space-y-4">
            <Button onClick={() => setEditing({ userName: '', userImage: '', storyImage: '' })} className="w-full">
              <Plus size={20} /> ADD STORY
            </Button>
            {stories.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img src={s.userImage} className="w-10 h-10 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <p className="font-bold">{s.userName}</p>
                </div>
                <button onClick={() => remove('stories', s.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}

        {tab === 'news' && (
          <div className="space-y-4">
            <Button onClick={() => setEditing({ title: '', summary: '', image: '', date: '' })} className="w-full">
              <Plus size={20} /> CREATE NEWS
            </Button>
            {news.map((n: any) => (
              <div key={n.id} className="bg-zinc-900 p-4 rounded-2xl">
                <p className="font-bold mb-1">{n.title}</p>
                <p className="text-xs text-zinc-500">{n.date}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditing(n)} className="p-2 text-zinc-400 hover:text-yellow-400"><Edit2 size={18} /></button>
                  <button onClick={() => remove('news', n.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'carousel' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                id="carousel-input"
                type="text" 
                placeholder="Image URL" 
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:border-yellow-400 outline-none"
              />
              <Button onClick={() => {
                const input = document.getElementById('carousel-input') as HTMLInputElement;
                if (input.value) {
                  setCarouselImages([...carouselImages, input.value]);
                  input.value = '';
                }
              }}>ADD</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {carouselImages.map((img: string, i: number) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => setCarouselImages(carouselImages.filter((_: any, idx: number) => idx !== i))}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase">EDIT {tab.slice(0, -1)}</h2>
            <button onClick={() => setEditing(null)} className="p-2 bg-zinc-900 rounded-full"><X size={20} /></button>
          </div>
          
          <div className="space-y-6">
            {tab === 'players' && (
              <>
                <Input label="Player Name" value={editing.name} onChange={(v: any) => setEditing({...editing, name: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Role" value={editing.role} options={['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper']} onChange={(v: any) => setEditing({...editing, role: v})} />
                  <Input label="Image URL" value={editing.image} onChange={(v: any) => setEditing({...editing, image: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Runs" type="number" value={editing.stats.runs} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, runs: parseInt(v)}})} />
                  <Input label="Wickets" type="number" value={editing.stats.wickets} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, wickets: parseInt(v)}})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Sixes" type="number" value={editing.stats.sixes} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, sixes: parseInt(v)}})} />
                  <Input label="Matches" type="number" value={editing.stats.matches} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, matches: parseInt(v)}})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Average" type="number" step="0.01" value={editing.stats.average} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, average: parseFloat(v)}})} />
                  <Input label="Strike Rate" type="number" step="0.01" value={editing.stats.strikeRate} onChange={(v: any) => setEditing({...editing, stats: {...editing.stats, strikeRate: parseFloat(v)}})} />
                </div>
              </>
            )}

            {tab === 'matches' && (
              <>
                <Input label="Opponent Name" value={editing.opponent} onChange={(v: any) => setEditing({...editing, opponent: v})} />
                <Input label="Opponent Logo URL" value={editing.opponentLogo} onChange={(v: any) => setEditing({...editing, opponentLogo: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date" value={editing.date} onChange={(v: any) => setEditing({...editing, date: v})} />
                  <Input label="Time" value={editing.time} onChange={(v: any) => setEditing({...editing, time: v})} />
                </div>
                <Input label="Venue" value={editing.venue} onChange={(v: any) => setEditing({...editing, venue: v})} />
                <Select label="Status" value={editing.status} options={['Upcoming', 'Live', 'Completed']} onChange={(v: any) => setEditing({...editing, status: v})} />
                {editing.status !== 'Upcoming' && (
                  <>
                    <Input label="Score (e.g. 145/4)" value={editing.score} onChange={(v: any) => setEditing({...editing, score: v})} />
                    <Input label="Result (e.g. Won by 20 runs)" value={editing.result} onChange={(v: any) => setEditing({...editing, result: v})} />
                  </>
                )}
              </>
            )}

            {tab === 'stories' && (
              <>
                <Input label="User Name" value={editing.userName} onChange={(v: any) => setEditing({...editing, userName: v})} />
                <Input label="User Image URL" value={editing.userImage} onChange={(v: any) => setEditing({...editing, userImage: v})} />
                <Input label="Story Image URL" value={editing.storyImage} onChange={(v: any) => setEditing({...editing, storyImage: v})} />
              </>
            )}

            {tab === 'news' && (
              <>
                <Input label="Title" value={editing.title} onChange={(v: any) => setEditing({...editing, title: v})} />
                <Input label="Summary" value={editing.summary} onChange={(v: any) => setEditing({...editing, summary: v})} />
                <Input label="Image URL" value={editing.image} onChange={(v: any) => setEditing({...editing, image: v})} />
                <Input label="Date" value={editing.date} onChange={(v: any) => setEditing({...editing, date: v})} />
              </>
            )}

            <Button onClick={() => save(tab, editing)} className="w-full py-4">
              <Save size={20} /> SAVE CHANGES
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", step }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">{label}</label>
      <input 
        type={type}
        step={step}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-colors" 
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-zinc-500 uppercase px-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-colors appearance-none"
      >
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
