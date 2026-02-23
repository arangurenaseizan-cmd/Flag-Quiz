/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  Heart, 
  Users, 
  Calendar, 
  Map as MapIcon, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  ShoppingBag,
  Star,
  Zap,
  HelpCircle,
  X,
  CheckCircle2,
  Info,
  RotateCcw,
  Home,
  User as UserIcon,
  UserRound,
  UserCircle,
  UserSquare,
  Contact,
  Moon,
  Sun,
  Globe,
  Compass,
  Camera,
  Backpack,
  Binoculars,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { countries, Country } from './data';
import { 
  GameMode, 
  UserState, 
  INITIAL_USER_STATE, 
  getRandomCountries, 
  getDailyChallenge,
  getXPForLevel
} from './gameLogic';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  isDarkMode = false
}: { 
  children: React.ReactNode; 
  onClick?: (e: any) => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'accent';
  className?: string;
  disabled?: boolean;
  isDarkMode?: boolean;
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md',
    secondary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md',
    accent: 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-md',
    outline: isDarkMode 
      ? 'border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400/10' 
      : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-md',
    ghost: isDarkMode ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-black/5 text-gray-600',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = "", isDarkMode = false }: { children: React.ReactNode, className?: string, isDarkMode?: boolean, key?: string | number }) => (
  <div className={`rounded-3xl p-6 shadow-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ progress, color = "bg-indigo-600" }: { progress: number, color?: string }) => (
  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className={`h-full ${color}`}
    />
  </div>
);

const TimerDisplay = ({ initialTime, onTimeUp, timeLeftRef }: { initialTime: number, onTimeUp: () => void, timeLeftRef: React.MutableRefObject<number> }) => {
  const [localTime, setLocalTime] = useState(initialTime);

  useEffect(() => {
    setLocalTime(initialTime);
    timeLeftRef.current = initialTime;
    const timer = setInterval(() => {
      setLocalTime((prev) => {
        const next = prev - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initialTime, onTimeUp, timeLeftRef]);

  return (
    <div className={`flex items-center gap-1 font-black ${localTime < 10 ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>
      <Timer className="w-5 h-5" />
      <span>{localTime}s</span>
    </div>
  );
};

const AVATARS = [
  { id: 'char-1', name: 'Alex', icon: UserIcon, color: 'text-indigo-600' },
  { id: 'char-2', name: 'Sam', icon: UserRound, color: 'text-rose-500' },
  { id: 'char-3', name: 'Jordan', icon: UserCircle, color: 'text-emerald-600' },
  { id: 'char-4', name: 'Casey', icon: UserSquare, color: 'text-amber-600' },
  { id: 'char-5', name: 'Taylor', icon: Contact, color: 'text-purple-600' },
];

const ROLES = [
  { id: 'role-1', name: 'Novato', icon: UserIcon, cost: 0 },
  { id: 'role-2', name: 'Brújula', icon: Compass, cost: 500 },
  { id: 'role-3', name: 'Fotógrafo', icon: Camera, cost: 1000 },
  { id: 'role-4', name: 'Cartógrafo', icon: MapIcon, cost: 1500 },
  { id: 'role-5', name: 'Mochilero', icon: Backpack, cost: 2000 },
  { id: 'role-6', name: 'Vigía', icon: Binoculars, cost: 2500 },
];

const getAvatarIcon = (id: string) => {
  const avatar = AVATARS.find(a => a.id === id);
  return avatar || AVATARS[0];
};

const getRoleIcon = (id: string) => {
  const role = ROLES.find(r => r.id === id);
  return role || ROLES[0];
};

// --- Screens ---

const SplashScreen = () => (
  <div className="fixed inset-0 bg-indigo-600 flex flex-col items-center justify-center text-white z-50">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center"
    >
      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
        <Globe className="w-20 h-20 text-indigo-600" />
      </div>
      <h1 className="text-5xl font-black tracking-tighter mb-2">FLAGQUEST</h1>
      <p className="text-indigo-100 font-medium tracking-widest uppercase text-sm">Desafío Mundial</p>
    </motion.div>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: 200 }}
      transition={{ delay: 0.5, duration: 1.5 }}
      className="h-1 bg-white/30 rounded-full mt-12 overflow-hidden"
    >
      <motion.div className="h-full bg-white w-full" />
    </motion.div>
  </div>
);

const MainMenu = ({ user, setScreen, startGame }: { user: UserState, setScreen: (s: any) => void, startGame: (m: GameMode) => void, key?: string }) => {
  const avatar = getAvatarIcon(user.avatar.base);
  const role = getRoleIcon(user.avatar.accessory);
  const Icon = avatar.icon;
  const RoleIcon = role.icon;
  
  return (
    <div className={`min-h-screen p-6 flex flex-col transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFC] text-gray-900'}`}>
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden border-2 relative ${user.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-indigo-100 border-indigo-200'}`}
            onClick={() => setScreen('avatar')}
          >
            <Icon className={avatar.color} />
            <div className={`absolute -bottom-1 -right-1 rounded-full p-0.5 shadow-sm ${user.isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
              <RoleIcon className={`w-3 h-3 ${user.isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
          </div>
          <div>
            <p className={`text-sm font-black ${user.isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{user.username}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nivel {user.level}</p>
          <div className={`w-32 h-1.5 rounded-full mt-1 overflow-hidden ${user.isDarkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-indigo-600" 
              style={{ width: `${(user.xp % 500) / 5}%` }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className={`px-4 py-2 rounded-2xl shadow-sm border flex items-center gap-2 ${user.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className={`font-bold ${user.isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>{user.coins}</span>
        </div>
        <Button variant="ghost" isDarkMode={user.isDarkMode} className="p-2 rounded-2xl" onClick={() => setScreen('settings')}>
          <Settings className="w-6 h-6" />
        </Button>
      </div>
    </header>

    <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative h-48 rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
        onClick={() => setScreen('adventure')}
      >
        <img 
          src="https://picsum.photos/seed/adventure/800/400" 
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-white text-3xl font-black">MODO AVENTURA</h2>
          <p className="text-white/80 text-sm font-medium">Explora el mundo nivel a nivel</p>
        </div>
        <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
          <MapIcon className="w-6 h-6" />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="accent" 
          className="h-32 flex-col gap-2 rounded-3xl"
          onClick={() => startGame('timed')}
        >
          <Timer className="w-8 h-8" />
          <span>Contrarreloj</span>
        </Button>
        <Button 
          variant="secondary" 
          className="h-32 flex-col gap-2 rounded-3xl"
          onClick={() => startGame('survival')}
        >
          <Heart className="w-8 h-8" />
          <span>Supervivencia</span>
        </Button>
        <Button 
          variant="outline" 
          isDarkMode={user.isDarkMode}
          className={`h-32 flex-col gap-2 rounded-3xl ${user.isDarkMode ? 'border-indigo-400/30' : 'border-indigo-200'}`}
          onClick={() => setScreen('multiplayer-setup')}
        >
          <Users className="w-8 h-8" />
          <span>Multijugador</span>
        </Button>
        <Button 
          variant="primary" 
          className="h-32 flex-col gap-2 rounded-3xl"
          onClick={() => startGame('daily')}
        >
          <Calendar className="w-8 h-8" />
          <span>Reto Diario</span>
        </Button>
      </div>
    </div>

    <nav className={`mt-8 flex justify-around items-center p-4 rounded-3xl shadow-lg border transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
      <Button variant="ghost" isDarkMode={user.isDarkMode} className="flex-col gap-1 p-2">
        <Home className={`w-6 h-6 ${user.isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <span className="text-[10px] font-bold uppercase">Inicio</span>
      </Button>
      <Button variant="ghost" isDarkMode={user.isDarkMode} className="flex-col gap-1 p-2" onClick={() => setScreen('avatar')}>
        <UserIcon className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">Perfil</span>
      </Button>
      <Button variant="ghost" isDarkMode={user.isDarkMode} className="flex-col gap-1 p-2" onClick={() => setScreen('achievements')}>
        <Trophy className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase">Logros</span>
      </Button>
    </nav>
  </div>
  );
};

const CONTINENT_LEVELS: Record<string, number> = {
  'Europe': 1,
  'Americas': 2,
  'Asia': 3,
  'Africa': 4,
  'Oceania': 5
};

const AdventureMap = ({ user, setScreen, setSelectedContinent, startGame }: { user: UserState, setScreen: (s: any) => void, setSelectedContinent: (c: string) => void, startGame: (m: GameMode, c: string) => void, key?: string }) => (
  <div className={`min-h-screen p-6 transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900 text-white' : 'bg-indigo-900 text-white'}`}>
    <header className="flex items-center gap-4 mb-8">
      <Button variant="ghost" isDarkMode={user.isDarkMode} className={`p-2 ${user.isDarkMode ? '' : 'text-white hover:bg-white/10'}`} onClick={() => setScreen('menu')}>
        <ChevronLeft className="w-8 h-8" />
      </Button>
      <h1 className="text-2xl font-black">MAPA MUNDIAL</h1>
    </header>

    <div className="grid gap-6">
      {['Europe', 'Americas', 'Asia', 'Africa', 'Oceania'].map((continent, idx) => {
        const requiredLevel = CONTINENT_LEVELS[continent] || 1;
        const isUnlocked = user.level >= requiredLevel;
        
        return (
          <motion.div
            key={continent}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative h-32 rounded-3xl overflow-hidden flex items-center p-6 transition-colors duration-300 ${isUnlocked ? (user.isDarkMode ? 'bg-slate-800 cursor-pointer' : 'bg-indigo-800 cursor-pointer') : (user.isDarkMode ? 'bg-slate-800/50 opacity-60' : 'bg-gray-800 opacity-60')}`}
            onClick={() => {
              if (isUnlocked) {
                setSelectedContinent(continent);
                startGame('adventure', continent);
              }
            }}
          >
            <div className="flex-1">
              <h3 className="text-xl font-black">{continent.toUpperCase()}</h3>
              <p className={`text-sm font-bold ${user.isDarkMode ? 'text-slate-400' : 'text-indigo-300'}`}>12/24 Países</p>
            </div>
            {isUnlocked ? (
              <Button 
                variant="accent" 
                className="rounded-2xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedContinent(continent);
                  startGame('adventure', continent);
                }}
              >
                Jugar
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xs font-black uppercase tracking-widest">Nivel {requiredLevel}</span>
                <Lock className="w-5 h-5" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  </div>
);

const GameScreen = ({ 
  questions, 
  currentIndex, 
  activeMode, 
  endGame, 
  timeLeftRef, 
  lives, 
  feedback, 
  options, 
  disabledOptions, 
  handleAnswer, 
  usePowerup, 
  showFact, 
  nextQuestion,
  setScreen,
  powerups,
  user
}: { 
  questions: Country[], 
  currentIndex: number, 
  activeMode: GameMode, 
  endGame: () => void, 
  timeLeftRef: React.MutableRefObject<number>, 
  lives: number, 
  feedback: 'correct' | 'wrong' | null, 
  options: Country[], 
  disabledOptions: string[], 
  handleAnswer: (c: Country) => void, 
  usePowerup: (t: any) => void, 
  showFact: Country | null, 
  nextQuestion: () => void,
  setScreen: (s: any) => void,
  powerups: { fiftyFifty: number, skip: number, hint: number },
  user: UserState,
  key?: string
}) => {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <Button variant="ghost" className="p-2" onClick={() => setScreen('menu')}>
          <X className="w-6 h-6" />
        </Button>
        
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-1">
            <span className="text-indigo-600">{user.username}</span>
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
          <ProgressBar progress={((currentIndex + 1) / questions.length) * 100} color={user.isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'} />
        </div>

        <div className="flex items-center gap-4">
          {activeMode === 'timed' ? (
            <TimerDisplay 
              initialTime={60} 
              onTimeUp={endGame} 
              timeLeftRef={timeLeftRef} 
            />
          ) : (
            <div className="flex items-center gap-1 text-rose-500 font-black">
              <Heart className="w-5 h-5 fill-rose-500" />
              <span>{lives}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div
          key={currentQuestion.id}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white w-full aspect-[4/3] rounded-[40px] shadow-2xl flex items-center justify-center mb-12 border-8 border-white relative overflow-hidden"
        >
          <img 
            src={`https://picsum.photos/seed/${currentQuestion.name}/800/600`}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt={currentQuestion.name}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent" />
          
          <motion.img
            key={`flag-${currentQuestion.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            src={`https://flagcdn.com/w640/${currentQuestion.id.toLowerCase()}.png`}
            className="relative z-10 w-4/5 h-auto rounded-xl shadow-2xl border-4 border-white"
            alt={`Bandera de ${currentQuestion.name}`}
          />
          
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute inset-0 flex items-center justify-center z-20 ${feedback === 'correct' ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}
            >
              {feedback === 'correct' ? (
                <CheckCircle2 className="w-32 h-32 text-white" />
              ) : (
                <X className="w-32 h-32 text-white" />
              )}
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {options.map((option, idx) => (
            <motion.button
              key={option.id}
              initial={{ x: idx % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              disabled={disabledOptions.includes(option.id) || !!feedback}
              onClick={() => handleAnswer(option)}
              className={`
                w-full py-5 px-8 rounded-3xl font-black text-lg shadow-lg border-b-4 transition-all
                ${disabledOptions.includes(option.id) ? 'opacity-20 grayscale' : ''}
                ${!feedback ? 'bg-white text-gray-700 border-gray-200 active:translate-y-1 active:border-b-0' : ''}
                ${feedback === 'correct' && option.id === currentQuestion.id ? 'bg-emerald-500 text-white border-emerald-700' : ''}
                ${feedback === 'wrong' && option.id === currentQuestion.id ? 'bg-emerald-500 text-white border-emerald-700' : ''}
                ${feedback === 'wrong' && option.id !== currentQuestion.id ? 'bg-rose-500 text-white border-rose-700' : ''}
              `}
            >
              {option.name}
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="mt-8 flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="flex-col p-4 rounded-3xl border-indigo-100 bg-white"
          onClick={() => usePowerup('fiftyFifty')}
          disabled={powerups.fiftyFifty === 0 || !!feedback}
        >
          <div className="relative">
            <Zap className="w-6 h-6 text-amber-500" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {powerups.fiftyFifty}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase mt-1">50/50</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-col p-4 rounded-3xl border-indigo-100 bg-white"
          onClick={() => usePowerup('hint')}
          disabled={powerups.hint === 0 || !!feedback}
        >
          <div className="relative">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {powerups.hint}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase mt-1">Pista</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-col p-4 rounded-3xl border-indigo-100 bg-white"
          onClick={() => usePowerup('skip')}
          disabled={powerups.skip === 0 || !!feedback}
        >
          <div className="relative">
            <RotateCcw className="w-6 h-6 text-emerald-500" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {powerups.skip}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase mt-1">Saltar</span>
        </Button>
      </footer>

      <AnimatePresence>
        {showFact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <img 
                src={`https://flagcdn.com/w320/${showFact.id.toLowerCase()}.png`}
                className="w-32 h-auto mx-auto mb-6 rounded-lg shadow-lg border-2 border-gray-100"
                alt={`Bandera de ${showFact.name}`}
              />
              <h2 className="text-2xl font-black text-gray-900 mb-2">{showFact.name}</h2>
              <div className="bg-indigo-50 p-6 rounded-3xl mb-6">
                <div className="flex items-center justify-center gap-2 text-indigo-600 font-black text-xs uppercase mb-2 tracking-widest">
                  <Info className="w-4 h-4" />
                  ¿Sabías que?
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic">
                  "{showFact.fact}"
                </p>
              </div>
              <Button variant="primary" className="w-full py-4 rounded-2xl" onClick={nextQuestion}>
                ¡Siguiente!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultsScreen = ({ score, setScreen, startGame, activeMode, user }: { score: number, setScreen: (s: any) => void, startGame: (m: any) => void, activeMode: GameMode, user: UserState, key?: string }) => (
  <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-white transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900' : 'bg-indigo-600'}`}>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center w-full max-w-md"
    >
      <Trophy className="w-24 h-24 mx-auto mb-6 text-amber-400 drop-shadow-lg" />
      <h1 className="text-5xl font-black mb-2">¡EXCELENTE!</h1>
      <p className={`font-bold mb-12 ${user.isDarkMode ? 'text-slate-400' : 'text-indigo-100'}`}>Has completado el desafío</p>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <Card isDarkMode={user.isDarkMode} className={`${user.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/10 border-white/20 text-white'}`}>
          <p className={`text-xs font-black uppercase mb-1 ${user.isDarkMode ? 'text-slate-500' : 'text-indigo-200'}`}>Puntos</p>
          <p className="text-3xl font-black">{score}</p>
        </Card>
        <Card isDarkMode={user.isDarkMode} className={`${user.isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/10 border-white/20 text-white'}`}>
          <p className={`text-xs font-black uppercase mb-1 ${user.isDarkMode ? 'text-slate-500' : 'text-indigo-200'}`}>XP Ganada</p>
          <p className="text-3xl font-black">+{score / 2}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Button variant="accent" className="w-full py-5 text-xl rounded-3xl" onClick={() => setScreen('menu')}>
          Continuar
        </Button>
        <Button variant="ghost" isDarkMode={user.isDarkMode} className={`rounded-3xl ${user.isDarkMode ? '' : 'text-white hover:bg-white/10'}`} onClick={() => startGame(activeMode)}>
          Jugar de nuevo
        </Button>
      </div>
    </motion.div>
  </div>
);

const AvatarScreen = ({ user, setUser, setScreen }: { user: UserState, setUser: React.Dispatch<React.SetStateAction<UserState>>, setScreen: (s: any) => void, key?: string }) => {
  const avatar = getAvatarIcon(user.avatar.base);
  const role = getRoleIcon(user.avatar.accessory);
  const Icon = avatar.icon;
  const RoleIcon = role.icon;

  const handleSelectAvatar = (selectedAvatar: typeof AVATARS[0]) => {
    setUser(prev => ({
      ...prev,
      avatar: { ...prev.avatar, base: selectedAvatar.id }
    }));
  };

  const handleSelectRole = (selectedRole: typeof ROLES[0]) => {
    const isUnlocked = user.unlockedAvatars.includes(selectedRole.id);
    
    if (isUnlocked) {
      setUser(prev => ({
        ...prev,
        avatar: { ...prev.avatar, accessory: selectedRole.id }
      }));
    } else {
      if (user.coins >= selectedRole.cost) {
        if (confirm(`¿Quieres desbloquear a ${selectedRole.name} por ${selectedRole.cost} estrellas?`)) {
          setUser(prev => ({
            ...prev,
            coins: prev.coins - selectedRole.cost,
            unlockedAvatars: [...prev.unlockedAvatars, selectedRole.id],
            avatar: { ...prev.avatar, accessory: selectedRole.id }
          }));
        }
      } else {
        alert("No tienes suficientes estrellas para desbloquear este rol.");
      }
    }
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFC] text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" isDarkMode={user.isDarkMode} className="p-2" onClick={() => setScreen('menu')}>
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <h1 className="text-2xl font-black">PERSONALIZAR</h1>
      </header>

      <div className="flex flex-col items-center gap-12 max-w-md mx-auto">
        <div className={`w-48 h-48 rounded-full shadow-2xl flex items-center justify-center border-8 relative transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'}`}>
          <Icon className={`w-24 h-24 ${avatar.color}`} />
          <div className={`absolute top-4 right-4 rounded-full p-2 shadow-md border transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-indigo-50'}`}>
            <RoleIcon className={`w-8 h-8 ${user.isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <div className="absolute -bottom-4 bg-indigo-600 text-white px-6 py-2 rounded-2xl font-black shadow-lg">
            NIVEL {user.level}
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest">Elige tu explorador</h3>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {AVATARS.map(char => {
              const isSelected = user.avatar.base === char.id;
              const CharIcon = char.icon;
              
              return (
                <motion.div 
                  key={char.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectAvatar(char)}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center border-4 cursor-pointer transition-all
                    ${isSelected ? 'bg-indigo-50 border-indigo-600' : user.isDarkMode ? 'bg-slate-800 border-transparent' : 'bg-white border-transparent'}
                  `}
                >
                  <CharIcon className={char.color} />
                  <span className={`text-[8px] font-black uppercase mt-1 ${isSelected ? 'text-indigo-600' : user.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{char.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest">Accesorios</h3>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${user.isDarkMode ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-100 border-amber-200'}`}>
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className={`text-xs font-black ${user.isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{user.coins}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {ROLES.map(roleItem => {
              const isUnlocked = user.unlockedAvatars.includes(roleItem.id);
              const isSelected = user.avatar.accessory === roleItem.id;
              const RoleItemIcon = roleItem.icon;
              
              return (
                <motion.div 
                  key={roleItem.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectRole(roleItem)}
                  className={`
                    aspect-square rounded-3xl flex flex-col items-center justify-center border-4 cursor-pointer transition-all relative
                    ${isSelected ? 'bg-indigo-50 border-indigo-600' : user.isDarkMode ? 'bg-slate-800 border-transparent' : 'bg-white border-transparent'}
                    ${!isUnlocked ? 'opacity-70' : ''}
                  `}
                >
                  <RoleItemIcon className={isSelected ? 'text-indigo-600' : isUnlocked ? (user.isDarkMode ? 'text-slate-300' : 'text-gray-600') : 'text-gray-400'} />
                  <span className={`text-[10px] font-black uppercase mt-1 ${isSelected ? 'text-indigo-600' : user.isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{roleItem.name}</span>
                  
                  {!isUnlocked && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-amber-950 p-1 rounded-lg shadow-sm flex items-center gap-0.5">
                      <Lock className="w-2 h-2" />
                      <span className="text-[7px] font-black">{roleItem.cost}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <Button variant="primary" className="w-full py-4 rounded-2xl" onClick={() => setScreen('menu')}>
          Hecho
        </Button>
      </div>
    </div>
  );
};

const AchievementsScreen = ({ user, setScreen }: { user: UserState, setScreen: (s: any) => void, key?: string }) => {
  const [tab, setTab] = useState<'daily' | 'stars' | 'survival' | 'challenges'>('daily');

  // Daily achievements: 1 to 30 days
  const dailyAchievements = Array.from({ length: 30 }, (_, i) => ({
    id: `daily-${i + 1}`,
    title: `${i + 1} ${i === 0 ? 'Día' : 'Días'}`,
    description: `Conéctate ${i + 1} ${i === 0 ? 'día seguido' : 'días seguidos'}`,
    target: i + 1,
    current: user.streak,
    completed: user.streak >= i + 1
  }));

  // Star achievements: 50 to 100,000 in steps of 50
  const currentBase = Math.floor(user.totalCoins / 50) * 50;
  const nextMilestones = Array.from({ length: 20 }, (_, i) => {
    const target = (Math.floor(user.totalCoins / 50) + i + 1) * 50;
    if (target > 100000) return null;
    return {
      id: `stars-${target}`,
      title: `${target.toLocaleString()} Estrellas`,
      description: `Colecciona un total de ${target.toLocaleString()} estrellas`,
      target: target,
      current: user.totalCoins,
      completed: user.totalCoins >= target
    };
  }).filter(Boolean);

  // Completed milestones (last 5)
  const completedMilestones = Array.from({ length: 5 }, (_, i) => {
    const target = (Math.floor(user.totalCoins / 50) - i) * 50;
    if (target <= 0) return null;
    return {
      id: `stars-done-${target}`,
      title: `${target.toLocaleString()} Estrellas`,
      description: `Coleccionaste ${target.toLocaleString()} estrellas`,
      target: target,
      current: user.totalCoins,
      completed: true
    };
  }).filter(Boolean);

  // Survival achievements: every 15 correct answers
  const survivalAchievements = Array.from({ length: 10 }, (_, i) => {
    const target = (i + 1) * 15;
    return {
      id: `survival-${target}`,
      title: `Superviviente ${target}`,
      description: `Logra una racha de ${target} respuestas correctas en Supervivencia`,
      target: target,
      current: user.bestSurvivalStreak || 0,
      completed: (user.bestSurvivalStreak || 0) >= target
    };
  });

  // Daily Challenge achievements: every 1 challenge
  const challengeAchievements = Array.from({ length: 20 }, (_, i) => {
    const target = i + 1;
    return {
      id: `challenge-${target}`,
      title: `Retador ${target}`,
      description: `Completa ${target} ${target === 1 ? 'reto diario' : 'retos diarios'}`,
      target: target,
      current: user.dailyChallengesCompleted || 0,
      completed: (user.dailyChallengesCompleted || 0) >= target
    };
  });

  return (
    <div className={`min-h-screen p-6 flex flex-col transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFC] text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" isDarkMode={user.isDarkMode} className="p-2" onClick={() => setScreen('menu')}>
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <h1 className="text-2xl font-black">LOGROS</h1>
      </header>

      <div className={`flex p-1 rounded-2xl mb-6 transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <button 
          onClick={() => setTab('daily')}
          className={`flex-1 py-3 rounded-xl font-black text-[8px] transition-all ${tab === 'daily' ? (user.isDarkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'bg-white shadow-sm text-indigo-600') : 'text-gray-500'}`}
        >
          CONEXIÓN
        </button>
        <button 
          onClick={() => setTab('stars')}
          className={`flex-1 py-3 rounded-xl font-black text-[8px] transition-all ${tab === 'stars' ? (user.isDarkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'bg-white shadow-sm text-indigo-600') : 'text-gray-500'}`}
        >
          ESTRELLAS
        </button>
        <button 
          onClick={() => setTab('survival')}
          className={`flex-1 py-3 rounded-xl font-black text-[8px] transition-all ${tab === 'survival' ? (user.isDarkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'bg-white shadow-sm text-indigo-600') : 'text-gray-500'}`}
        >
          SUPERVIVENCIA
        </button>
        <button 
          onClick={() => setTab('challenges')}
          className={`flex-1 py-3 rounded-xl font-black text-[8px] transition-all ${tab === 'challenges' ? (user.isDarkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'bg-white shadow-sm text-indigo-600') : 'text-gray-500'}`}
        >
          RETOS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {tab === 'daily' && dailyAchievements.map(ach => (
          <Card key={ach.id} isDarkMode={user.isDarkMode} className={`flex items-center gap-4 p-4 ${ach.completed ? (user.isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200') : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ach.completed ? 'bg-indigo-600 text-white' : (user.isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400')}`}>
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`font-black text-sm ${ach.completed ? (user.isDarkMode ? 'text-indigo-300' : 'text-indigo-900') : (user.isDarkMode ? 'text-slate-300' : 'text-gray-700')}`}>{ach.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ach.description}</p>
              <div className="mt-2">
                <ProgressBar progress={Math.min(100, (ach.current / ach.target) * 100)} color={ach.completed ? 'bg-indigo-600' : (user.isDarkMode ? 'bg-slate-700' : 'bg-gray-300')} />
              </div>
            </div>
            {ach.completed && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
          </Card>
        ))}

        {tab === 'stars' && (
          <>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Próximos Retos</div>
            {nextMilestones.map(ach => ach && (
              <Card key={ach.id} isDarkMode={user.isDarkMode} className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400'}`}>
                  <Star className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-black text-sm ${user.isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{ach.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ach.description}</p>
                  <div className="mt-2">
                    <ProgressBar progress={Math.min(100, (ach.current / ach.target) * 100)} color={user.isDarkMode ? 'bg-slate-700' : 'bg-gray-300'} />
                  </div>
                </div>
                <div className="text-[10px] font-black text-gray-400">{ach.current.toLocaleString()} / {ach.target.toLocaleString()}</div>
              </Card>
            ))}
            
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-8 mb-2">Completados</div>
            {completedMilestones.map(ach => ach && (
              <Card key={ach.id} isDarkMode={user.isDarkMode} className={`flex items-center gap-4 p-4 ${user.isDarkMode ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-black text-sm ${user.isDarkMode ? 'text-emerald-300' : 'text-emerald-900'}`}>{ach.title}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${user.isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>{ach.description}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </Card>
            ))}
          </>
        )}

        {tab === 'survival' && survivalAchievements.map(ach => (
          <Card key={ach.id} isDarkMode={user.isDarkMode} className={`flex items-center gap-4 p-4 ${ach.completed ? (user.isDarkMode ? 'bg-rose-900/20 border-rose-500/30' : 'bg-rose-50 border-rose-200') : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ach.completed ? 'bg-rose-600 text-white' : (user.isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400')}`}>
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`font-black text-sm ${ach.completed ? (user.isDarkMode ? 'text-rose-300' : 'text-rose-900') : (user.isDarkMode ? 'text-slate-300' : 'text-gray-700')}`}>{ach.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ach.description}</p>
              <div className="mt-2">
                <ProgressBar progress={Math.min(100, (ach.current / ach.target) * 100)} color={ach.completed ? 'bg-rose-600' : (user.isDarkMode ? 'bg-slate-700' : 'bg-gray-300')} />
              </div>
            </div>
            <div className="text-[10px] font-black text-gray-400">{ach.current} / {ach.target}</div>
            {ach.completed && <CheckCircle2 className="w-6 h-6 text-rose-600" />}
          </Card>
        ))}

        {tab === 'challenges' && challengeAchievements.map(ach => (
          <Card key={ach.id} isDarkMode={user.isDarkMode} className={`flex items-center gap-4 p-4 ${ach.completed ? (user.isDarkMode ? 'bg-amber-900/20 border-amber-500/30' : 'bg-amber-50 border-amber-200') : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ach.completed ? 'bg-amber-500 text-white' : (user.isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-100 text-gray-400')}`}>
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className={`font-black text-sm ${ach.completed ? (user.isDarkMode ? 'text-amber-300' : 'text-amber-900') : (user.isDarkMode ? 'text-slate-300' : 'text-gray-700')}`}>{ach.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{ach.description}</p>
              <div className="mt-2">
                <ProgressBar progress={Math.min(100, (ach.current / ach.target) * 100)} color={ach.completed ? 'bg-amber-500' : (user.isDarkMode ? 'bg-slate-700' : 'bg-gray-300')} />
              </div>
            </div>
            <div className="text-[10px] font-black text-gray-400">{ach.current} / {ach.target}</div>
            {ach.completed && <CheckCircle2 className="w-6 h-6 text-amber-500" />}
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsScreen = ({ user, setUser, setScreen }: { user: UserState, setUser: React.Dispatch<React.SetStateAction<UserState>>, setScreen: (s: any) => void, key?: string }) => {
  return (
    <div className={`min-h-screen p-6 flex flex-col transition-colors duration-300 ${user.isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#F8FAFC] text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" isDarkMode={user.isDarkMode} className="p-2" onClick={() => setScreen('menu')}>
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <h1 className="text-2xl font-black">AJUSTES</h1>
      </header>

      <div className="flex-1 max-w-md mx-auto w-full space-y-8">
        <section>
          <h3 className="font-black text-gray-400 uppercase text-xs mb-4 tracking-widest">Perfil</h3>
          <Card className="p-6" isDarkMode={user.isDarkMode}>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Nombre de Usuario</label>
                <input 
                  type="text" 
                  value={user.username}
                  onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full border-2 rounded-2xl px-4 py-3 font-bold outline-none transition-all ${user.isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-indigo-400' : 'bg-gray-50 border-gray-100 text-gray-700 focus:border-indigo-600'}`}
                  placeholder="Tu nombre..."
                />
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h3 className="font-black text-gray-400 uppercase text-xs mb-4 tracking-widest">Apariencia</h3>
          <Card className="p-6" isDarkMode={user.isDarkMode}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.isDarkMode ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-600'}`}>
                  {user.isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <p className={`font-black ${user.isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Modo Oscuro</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Cambia el tema visual</p>
                </div>
              </div>
              <button 
                onClick={() => setUser(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }))}
                className={`w-14 h-8 rounded-full transition-all relative ${user.isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: user.isDarkMode ? 24 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </Card>
        </section>
      </div>

      <Button variant="primary" className="w-full py-4 rounded-2xl mt-auto" onClick={() => setScreen('menu')}>
        Guardar y Volver
      </Button>
    </div>
  );
};

const MultiplayerSetup = ({ startGame, setScreen }: { startGame: (m: any) => void, setScreen: (s: any) => void, key?: string }) => (
  <div className="min-h-screen bg-indigo-600 p-6 text-white flex flex-col items-center justify-center">
    <Trophy className="w-20 h-20 mb-8 text-amber-400" />
    <h1 className="text-4xl font-black mb-4">DUELO LOCAL</h1>
    <p className="text-indigo-100 text-center mb-12 font-medium">
      Dos jugadores en el mismo dispositivo.<br/>¡El más rápido gana!
    </p>

    <div className="w-full max-w-sm space-y-4">
      <Button variant="accent" className="w-full py-5 rounded-3xl text-xl" onClick={() => startGame('multiplayer')}>
        ¡Empezar Duelo!
      </Button>
      <Button variant="ghost" className="w-full text-white hover:bg-white/10 rounded-3xl" onClick={() => setScreen('menu')}>
        Volver
      </Button>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'menu' | 'adventure' | 'game' | 'results' | 'avatar' | 'multiplayer-setup' | 'achievements' | 'settings'>('splash');
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('flagquest_user');
      const parsed = saved ? JSON.parse(saved) : null;
      
      const state = { ...INITIAL_USER_STATE };
      if (parsed && typeof parsed === 'object') {
        Object.assign(state, parsed);
        // Ensure nested objects are also merged/initialized
        state.avatar = { ...INITIAL_USER_STATE.avatar, ...(parsed.avatar || {}) };
        state.unlockedAvatars = Array.isArray(parsed.unlockedAvatars) ? parsed.unlockedAvatars : INITIAL_USER_STATE.unlockedAvatars;
        state.dailyChallengesCompleted = typeof parsed.dailyChallengesCompleted === 'number' ? parsed.dailyChallengesCompleted : INITIAL_USER_STATE.dailyChallengesCompleted;
        // Force unlock all continents as per user request
        state.unlockedContinents = INITIAL_USER_STATE.unlockedContinents;
      }
      return state;
    } catch (e) {
      console.error("Error loading user state:", e);
      return INITIAL_USER_STATE;
    }
  });
  const [activeMode, setActiveMode] = useState<GameMode>('adventure');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  
  // Game State
  const [questions, setQuestions] = useState<Country[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const timeLeftRef = React.useRef(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showFact, setShowFact] = useState<Country | null>(null);
  const [powerups, setPowerups] = useState({ fiftyFifty: 2, skip: 1, hint: 2 });
  const [options, setOptions] = useState<Country[]>([]);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Multiplayer State
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [turn, setTurn] = useState<'p1' | 'p2'>('p1');

  useEffect(() => {
    // Daily Login Logic
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    
    // Check if it's a different day
    if (now.toDateString() !== lastLogin.toDateString()) {
      const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setUser(prev => {
        let newStreak = prev.streak;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // Reset streak if missed a day
        }
        
        return {
          ...prev,
          streak: newStreak,
          lastLogin: now.toISOString()
        };
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flagquest_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => setScreen('menu'), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const generateOptions = useCallback((correct: Country) => {
    const wrong = getRandomCountries(3, correct.id, selectedContinent || undefined);
    const all = [...wrong, correct].sort(() => 0.5 - Math.random());
    setOptions(all);
    setDisabledOptions([]);
  }, [selectedContinent]);

  const startGame = useCallback((mode: GameMode, continent?: string) => {
    setActiveMode(mode);
    setScore(0);
    setCurrentIndex(0);
    setLives(mode === 'survival' ? 1 : 3);
    setGameEnded(false);
    setFeedback(null);
    setDisabledOptions([]);
    
    let gameQuestions: Country[] = [];
    if (mode === 'daily') {
      gameQuestions = getDailyChallenge();
    } else {
      gameQuestions = getRandomCountries(10, undefined, continent);
    }
    
    setQuestions(gameQuestions);
    generateOptions(gameQuestions[0]);
    
    if (mode === 'timed') timeLeftRef.current = 60;
    setScreen('game');
  }, [selectedContinent, generateOptions]);

  const endGame = useCallback(() => {
    setGameEnded(true);
    setScreen('results');
    if (score > 0) {
      const xpGained = score / 2;
      const coinsGained = Math.floor(score / 10);
      
      setUser(prev => {
        const newXP = prev.xp + xpGained;
        const newLevel = Math.floor(newXP / 500) + 1;
        
        let newBestSurvival = prev.bestSurvivalStreak || 0;
        if (activeMode === 'survival') {
          const currentStreak = Math.floor(score / 100);
          if (currentStreak > newBestSurvival) {
            newBestSurvival = currentStreak;
          }
        }

        let newDailyCompleted = prev.dailyChallengesCompleted || 0;
        if (activeMode === 'daily') {
          newDailyCompleted += 1;
        }

        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          coins: prev.coins + coinsGained,
          totalCoins: prev.totalCoins + coinsGained,
          bestSurvivalStreak: newBestSurvival,
          dailyChallengesCompleted: newDailyCompleted
        };
      });

      if (score > 500) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [score, activeMode]);

  const nextQuestion = useCallback(() => {
    setShowFact(null);
    setFeedback(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      generateOptions(questions[nextIdx]);
      if (activeMode === 'multiplayer') setTurn(prev => prev === 'p1' ? 'p2' : 'p1');
    } else {
      endGame();
    }
  }, [currentIndex, questions, activeMode, endGame, generateOptions]);

  const handleAnswer = useCallback((selected: Country) => {
    if (feedback || gameEnded) return;

    const isCorrect = selected.id === questions[currentIndex].id;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 100 + (activeMode === 'timed' ? timeLeftRef.current : 0));
      if (activeMode === 'multiplayer') {
        if (turn === 'p1') setP1Score(s => s + 1);
        else setP2Score(s => s + 1);
      }
      
      // Show fact after a short delay
      setTimeout(() => {
        setShowFact(questions[currentIndex]);
      }, 500);
    } else {
      setFeedback('wrong');
      if (activeMode === 'survival') {
        endGame();
      } else {
        setLives(prev => prev - 1);
        if (lives <= 1) {
          setTimeout(() => endGame(), 1000);
        }
      }
    }

    if (!isCorrect && lives > 1) {
      setTimeout(() => {
        setFeedback(null);
        nextQuestion();
      }, 1000);
    }
  }, [feedback, gameEnded, questions, currentIndex, activeMode, turn, lives, endGame, nextQuestion]);

  const usePowerup = useCallback((type: 'fiftyFifty' | 'skip' | 'hint') => {
    if (powerups[type] <= 0 || feedback) return;

    setPowerups(prev => ({ ...prev, [type]: prev[type] - 1 }));

    if (type === 'fiftyFifty') {
      const correct = questions[currentIndex];
      const wrong = options.filter(o => o.id !== correct.id);
      const toDisable = wrong.sort(() => 0.5 - Math.random()).slice(0, 2).map(o => o.id);
      setDisabledOptions(toDisable);
    } else if (type === 'skip') {
      nextQuestion();
    } else if (type === 'hint') {
      // Show continent or first letter
      alert(`Pista: Este país está en ${questions[currentIndex].continent}`);
    }
  }, [powerups, feedback, questions, currentIndex, options, nextQuestion]);

  return (
    <div className="font-sans text-gray-900 select-none">
      <AnimatePresence mode="wait">
        {screen === 'splash' && <SplashScreen key="splash" />}
        {screen === 'menu' && <MainMenu key="menu" user={user} setScreen={setScreen} startGame={startGame} />}
        {screen === 'adventure' && <AdventureMap key="adventure" user={user} setScreen={setScreen} setSelectedContinent={setSelectedContinent} startGame={startGame} />}
        {screen === 'game' && (
          <GameScreen 
            key="game" 
            questions={questions} 
            currentIndex={currentIndex} 
            activeMode={activeMode} 
            endGame={endGame} 
            timeLeftRef={timeLeftRef} 
            lives={lives} 
            feedback={feedback} 
            options={options} 
            disabledOptions={disabledOptions} 
            handleAnswer={handleAnswer} 
            usePowerup={usePowerup} 
            showFact={showFact} 
            nextQuestion={nextQuestion}
            setScreen={setScreen}
            powerups={powerups}
            user={user}
          />
        )}
        {screen === 'results' && <ResultsScreen key="results" score={score} setScreen={setScreen} startGame={startGame} activeMode={activeMode} user={user} />}
        {screen === 'avatar' && <AvatarScreen key="avatar" user={user} setUser={setUser} setScreen={setScreen} />}
        {screen === 'settings' && <SettingsScreen key="settings" user={user} setUser={setUser} setScreen={setScreen} />}
        {screen === 'achievements' && <AchievementsScreen key="achievements" user={user} setScreen={setScreen} />}
        {screen === 'multiplayer-setup' && <MultiplayerSetup key="multiplayer" startGame={startGame} setScreen={setScreen} />}
      </AnimatePresence>
    </div>
  );
}
