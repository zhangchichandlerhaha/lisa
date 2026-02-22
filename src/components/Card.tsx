
import React from 'react';
import { motion } from 'motion/react';
import { Suit, Rank } from '../types';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface CardProps {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

const SuitIcon = ({ suit, size = 24 }: { suit: Suit; size?: number }) => {
  switch (suit) {
    case 'hearts': return <Heart size={size} className="text-red-500 fill-red-500" />;
    case 'diamonds': return <Diamond size={size} className="text-red-500 fill-red-500" />;
    case 'clubs': return <Club size={size} className="text-slate-900 fill-slate-900" />;
    case 'spades': return <Spade size={size} className="text-slate-900 fill-slate-900" />;
  }
};

export const CardComponent: React.FC<CardProps> = ({ 
  suit, 
  rank, 
  hidden = false, 
  onClick, 
  isPlayable = false,
  className = ""
}) => {
  if (hidden) {
    return (
      <motion.div
        whileHover={onClick ? { y: -10, rotate: 2 } : {}}
        className={`w-14 h-20 sm:w-24 sm:h-36 bg-indigo-900 rounded-xl border-2 border-white/20 flex items-center justify-center card-shadow overflow-hidden ${className}`}
      >
        <div className="w-full h-full m-1 border border-white/10 rounded-lg bg-[repeating-linear-gradient(45deg,#312e81,#312e81_10px,#3730a3_10px,#3730a3_20px)] relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-12 h-12 border-4 border-white rounded-full" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`${rank}-${suit}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isPlayable ? { y: -25, scale: 1.1, rotate: 2 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-14 h-20 sm:w-24 sm:h-36 bg-white rounded-xl border-2 
        ${isPlayable ? 'border-emerald-400 cursor-pointer shadow-[0_0_25px_rgba(52,211,153,0.4)]' : 'border-slate-200'} 
        flex flex-col p-1 sm:p-3 text-slate-900 card-shadow select-none
        ${className}
      `}
    >
      <div className="flex flex-col items-start leading-none">
        <span className={`text-xs sm:text-xl font-black ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
          {rank}
        </span>
        <SuitIcon suit={suit} size={12} />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
        <SuitIcon suit={suit} size={64} />
      </div>

      <div className="mt-auto flex flex-col items-end leading-none rotate-180">
        <span className={`text-xs sm:text-xl font-black ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
          {rank}
        </span>
        <SuitIcon suit={suit} size={12} />
      </div>
    </motion.div>
  );
};
