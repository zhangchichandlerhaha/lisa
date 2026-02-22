/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useGameLogic } from './hooks/useGameLogic';
import { CardComponent } from './components/Card';
import { Suit, Card } from './types';
import { Heart, Diamond, Club, Spade, RotateCcw, Info, Home } from 'lucide-react';

export default function App() {
  const { state, playCard, drawCard, selectSuit, restartGame, isValidMove, startGame, goHome } = useGameLogic();

  const SuitIcon = ({ suit, size = 24, className = "" }: { suit: Suit; size?: number; className?: string }) => {
    switch (suit) {
      case 'hearts': return <Heart size={size} className={`text-red-500 fill-red-500 ${className}`} />;
      case 'diamonds': return <Diamond size={size} className={`text-red-500 fill-red-500 ${className}`} />;
      case 'clubs': return <Club size={size} className={`text-slate-900 fill-slate-900 ${className}`} />;
      case 'spades': return <Spade size={size} className={`text-slate-900 fill-slate-900 ${className}`} />;
    }
  };

  if (state.status === 'home') {
    return (
      <div className="h-screen w-full poker-table flex flex-col items-center justify-center p-6 text-white font-sans overflow-y-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-2xl w-full bg-black/40 backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 sm:p-12 shadow-2xl text-center"
        >
          <div className="flex justify-center gap-4 mb-6">
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><SuitIcon suit="hearts" size={40} /></motion.div>
            <motion.div animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}><SuitIcon suit="spades" size={40} /></motion.div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-display font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            LISA CRAZY 8S
          </h1>
          
          <p className="text-indigo-200/70 text-lg mb-10 font-medium">
            The ultimate classic card game experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-12">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <Info size={14} /> How to Play
              </h3>
              <ul className="text-sm space-y-2 text-white/80">
                <li>• Match the <span className="text-white font-bold">Suit</span> or <span className="text-white font-bold">Rank</span> of the top card.</li>
                <li>• <span className="text-white font-bold">8s are Wild!</span> Play them anytime to change the suit.</li>
                <li>• Draw from the deck if you have no moves.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                <RotateCcw size={14} /> Scoring
              </h3>
              <ul className="text-sm space-y-2 text-white/80">
                <li>• <span className="text-white font-bold">8s</span> = 50 Points</li>
                <li>• <span className="text-white font-bold">K, Q, J</span> = 10 Points</li>
                <li>• <span className="text-white font-bold">Aces</span> = 1 Point</li>
                <li>• Be the first to empty your hand!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={startGame}
            className="group relative w-full sm:w-64 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-indigo-500/40 transition-all active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">PLAY NOW</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </button>
        </motion.div>
        
        <p className="mt-8 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
          Inspired by Coolmath Games
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full poker-table flex flex-col items-center justify-between p-2 sm:p-4 overflow-hidden font-sans text-white">
      {/* Top Bar: Scores & Round */}
      <div className="w-full max-w-4xl flex justify-between items-center px-6 py-3 bg-black/40 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Round</span>
            <span className="text-xl font-display font-black">{state.round}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Your Score</span>
            <span className="text-xl font-display font-black text-emerald-400">{state.scores.player}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">AI Score</span>
            <span className="text-xl font-display font-black text-red-400">{state.scores.ai}</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <button 
            onClick={goHome}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 border border-white/5"
            title="Go to Home"
          >
            <Home size={20} />
          </button>
          <button 
            onClick={restartGame}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 border border-white/5"
            title="Restart Game"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* AI Area */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 px-4 py-1 bg-black/20 rounded-full border border-white/5">
          <div className={`w-2 h-2 rounded-full ${state.turn === 'ai' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">LISA Bot ({state.aiHand.length} cards)</span>
        </div>
        <div className="relative w-full flex justify-center h-24 sm:h-32">
          <div className="flex -space-x-10 sm:-space-x-14">
            {state.aiHand.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <CardComponent suit={card.suit} rank={card.rank} hidden className="scale-90 sm:scale-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Center Table */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl relative">
        {/* Action Log */}
        <AnimatePresence mode="wait">
          {state.lastAction && (
            <motion.div
              key={state.lastAction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 bg-white/5 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-white/5"
            >
              {state.lastAction}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-12 sm:gap-24">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div 
              onClick={() => state.turn === 'player' && state.status === 'playing' && drawCard('player')}
              className={`relative cursor-pointer ${state.turn === 'player' && state.status === 'playing' ? 'hover:scale-105 active:scale-95' : 'opacity-50 grayscale'} transition-all`}
            >
              <CardComponent suit="hearts" rank="A" hidden className="shadow-2xl border-white/40" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                  <span className="text-white font-black text-sm tracking-tighter">DRAW</span>
                </div>
              </div>
              {/* Deck Count Badge */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <span className="text-xs font-black">{state.deck.length}</span>
              </div>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <div className="absolute -inset-8 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={state.discardPile[0].id}
                initial={{ scale: 0.5, opacity: 0, rotate: -20, x: -100 }}
                animate={{ scale: 1, opacity: 1, rotate: 0, x: 0 }}
                className="relative z-10"
              >
                <CardComponent 
                  suit={state.discardPile[0].suit} 
                  rank={state.discardPile[0].rank} 
                  className="shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Current Suit Indicator */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            >
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl">
                <SuitIcon suit={state.currentSuit} size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-white/40">Active</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Player Area */}
      <div className="w-full flex flex-col items-center gap-4 pb-4">
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full border transition-all ${state.turn === 'player' ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-black/20 border-white/5 opacity-50'}`}>
          <div className={`w-2 h-2 rounded-full ${state.turn === 'player' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-sm font-black uppercase tracking-widest">Your Turn</span>
        </div>
        
        <div className="w-full max-w-6xl overflow-x-auto pb-6 px-8 no-scrollbar">
          <div className="flex justify-center -space-x-8 sm:-space-x-12 min-w-max px-10">
            {state.playerHand.map((card, index) => (
              <CardComponent
                key={card.id}
                suit={card.suit}
                rank={card.rank}
                isPlayable={state.turn === 'player' && state.status === 'playing' && isValidMove(card)}
                onClick={() => playCard(card, 'player')}
                className="transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Suit Picker Modal */}
      <AnimatePresence>
        {state.status === 'choosing_suit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full text-center"
            >
              <h2 className="text-2xl font-display font-bold mb-2">Wild 8!</h2>
              <p className="text-slate-400 mb-8">Choose the next suit to play</p>
              
              <div className="grid grid-cols-2 gap-4">
                {(['hearts', 'diamonds', 'clubs', 'spades'] as Suit[]).map((suit) => (
                  <button
                    key={suit}
                    onClick={() => selectSuit(suit)}
                    className="flex flex-col items-center gap-3 p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group active:scale-95"
                  >
                    <SuitIcon suit={suit} size={40} />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                      {suit}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {state.status === 'game_over' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-slate-800 p-10 rounded-[2.5rem] border-2 border-white/10 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="mb-6 inline-flex p-4 bg-white/5 rounded-full">
                {state.winner === 'player' ? (
                  <div className="text-5xl">🏆</div>
                ) : (
                  <div className="text-5xl">🤖</div>
                )}
              </div>

              <h2 className="text-4xl font-display font-black mb-2 tracking-tight">
                {state.winner === 'player' ? "YOU WIN!" : "LISA WINS!"}
              </h2>
              <p className="text-slate-400 mb-10 text-lg">
                {state.winner === 'player' 
                  ? "Incredible performance! You've mastered the 8s." 
                  : "Better luck next time! LISA was too fast."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={restartGame}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Play Again
                </button>
                <button
                  onClick={goHome}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-lg border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
