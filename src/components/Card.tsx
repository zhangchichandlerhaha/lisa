
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
        whileHover={onClick ? { y: -10 } : {}}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-indigo-800 rounded-lg border-2 border-white/20 flex items-center justify-center card-shadow ${className}`}
      >
        <div className="w-full h-full m-1 border border-white/10 rounded-md bg-[repeating-linear-gradient(45deg,#312e81,#312e81_10px,#3730a3_10px,#3730a3_20px)]" />
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`${rank}-${suit}`}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border-2 
        ${isPlayable ? 'border-yellow-400 cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-slate-200'} 
        flex flex-col p-1 sm:p-2 text-slate-900 card-shadow select-none
        ${className}
      `}
    >
      <div className="flex flex-col items-start leading-none">
        <span className={`text-sm sm:text-lg font-bold ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
          {rank}
        </span>
        <SuitIcon suit={suit} size={14} />
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <SuitIcon suit={suit} size={48} />
      </div>

      <div className="mt-auto flex flex-col items-end leading-none rotate-180">
        <span className={`text-sm sm:text-lg font-bold ${suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-slate-900'}`}>
          {rank}
        </span>
        <SuitIcon suit={suit} size={14} />
      </div>
    </motion.div>
  );
};
