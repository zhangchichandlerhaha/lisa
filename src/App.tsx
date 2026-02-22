/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useGameLogic } from './hooks/useGameLogic';
import { CardComponent } from './components/Card';
import { Suit, Card } from './types';
import { Heart, Diamond, Club, Spade, RotateCcw, Info } from 'lucide-react';

export default function App() {
  const { state, playCard, drawCard, selectSuit, restartGame, isValidMove } = useGameLogic();

  const SuitIcon = ({ suit, size = 24 }: { suit: Suit; size?: number }) => {
    switch (suit) {
      case 'hearts': return <Heart size={size} className="text-red-500 fill-red-500" />;
      case 'diamonds': return <Diamond size={size} className="text-red-500 fill-red-500" />;
      case 'clubs': return <Club size={size} className="text-slate-900 fill-slate-900" />;
      case 'spades': return <Spade size={size} className="text-slate-900 fill-slate-900" />;
    }
  };

  return (
    <div className="h-screen w-full poker-table flex flex-col items-center justify-between p-4 overflow-hidden font-sans">
      {/* Header / AI Info */}
      <div className="w-full flex justify-between items-center px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-white/20">
            <span className="text-xs font-bold">AI</span>
          </div>
          <div>
            <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">Opponent</p>
            <p className="text-sm font-bold">LISA Bot</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-center">
            <p className="text-[10px] opacity-60 uppercase">Deck</p>
            <p className="text-lg font-mono font-bold">{state.deck.length}</p>
          </div>
          <button 
            onClick={restartGame}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* AI Hand */}
      <div className="relative w-full flex justify-center h-32 sm:h-40">
        <div className="flex -space-x-8 sm:-space-x-12">
          {state.aiHand.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <CardComponent suit={card.suit} rank={card.rank} hidden />
            </motion.div>
          ))}
        </div>
        {state.turn === 'ai' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-4 bg-indigo-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest shadow-lg"
          >
            Thinking...
          </motion.div>
        )}
      </div>

      {/* Center Table */}
      <div className="flex-1 flex items-center justify-center gap-8 sm:gap-16 w-full">
        {/* Draw Pile */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-white/5 rounded-xl blur-xl group-hover:bg-white/10 transition-all" />
          <div 
            onClick={() => state.turn === 'player' && state.status === 'playing' && drawCard('player')}
            className={`relative cursor-pointer ${state.turn === 'player' && state.status === 'playing' ? 'hover:scale-105 active:scale-95' : 'opacity-80'} transition-transform`}
          >
            <CardComponent suit="hearts" rank="A" hidden className="shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-xl drop-shadow-md">DRAW</span>
            </div>
          </div>
        </div>

        {/* Discard Pile */}
        <div className="relative">
          <div className="absolute -inset-4 bg-yellow-500/10 rounded-full blur-2xl" />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={state.discardPile[0].id}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="relative"
            >
              <CardComponent 
                suit={state.discardPile[0].suit} 
                rank={state.discardPile[0].rank} 
                className="shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Current Suit Indicator (for 8s) */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold opacity-50 uppercase vertical-text">Active</p>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
              <SuitIcon suit={state.currentSuit} size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-white/60">
          <Info size={14} />
          <p className="text-xs font-medium">
            {state.turn === 'player' ? "Your turn! Match the suit or rank." : "LISA is playing..."}
          </p>
        </div>
        
        <div className="w-full max-w-5xl overflow-x-auto pb-8 px-4 no-scrollbar">
          <div className="flex justify-center -space-x-6 sm:-space-x-10 min-w-max">
            {state.playerHand.map((card) => (
              <CardComponent
                key={card.id}
                suit={card.suit}
                rank={card.rank}
                isPlayable={state.turn === 'player' && state.status === 'playing' && isValidMove(card)}
                onClick={() => playCard(card, 'player')}
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
              
              <button
                onClick={restartGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Play Again
              </button>
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
