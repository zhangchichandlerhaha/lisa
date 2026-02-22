
import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, Suit, Rank, Turn } from '../types';
import { createDeck, shuffle, INITIAL_HAND_SIZE, SUITS } from '../constants';

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(() => {
    const deck = shuffle(createDeck());
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = deck.splice(0, INITIAL_HAND_SIZE);
    
    let firstDiscardIndex = 0;
    while (deck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const discardPile = [deck.splice(firstDiscardIndex, 1)[0]];
    
    return {
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentSuit: discardPile[0].suit,
      currentRank: discardPile[0].rank,
      turn: 'player',
      status: 'home',
      winner: null,
      scores: { player: 0, ai: 0 },
      round: 1,
      lastAction: null,
    };
  });

  const startGame = () => {
    setState(prev => ({ ...prev, status: 'playing' }));
  };

  const goHome = () => {
    setState(prev => ({ ...prev, status: 'home' }));
  };

  const calculateScore = (hand: Card[]) => {
    return hand.reduce((total, card) => {
      if (card.rank === '8') return total + 50;
      if (['K', 'Q', 'J'].includes(card.rank)) return total + 10;
      if (card.rank === 'A') return total + 1;
      return total + parseInt(card.rank === '10' ? '10' : card.rank);
    }, 0);
  };

  const checkWinner = useCallback((newState: GameState) => {
    if (newState.playerHand.length === 0 || newState.aiHand.length === 0 || (newState.deck.length === 0 && !newState.playerHand.find(c => c.rank === '8' || c.suit === newState.currentSuit || c.rank === newState.currentRank) && !newState.aiHand.find(c => c.rank === '8' || c.suit === newState.currentSuit || c.rank === newState.currentRank))) {
      const playerScore = calculateScore(newState.playerHand);
      const aiScore = calculateScore(newState.aiHand);
      
      let winner: Turn | null = null;
      if (newState.playerHand.length === 0) winner = 'player';
      else if (newState.aiHand.length === 0) winner = 'ai';
      else winner = playerScore < aiScore ? 'player' : 'ai';

      return { 
        ...newState, 
        status: 'game_over' as const, 
        winner,
        scores: {
          player: newState.scores.player + (winner === 'player' ? aiScore : 0),
          ai: newState.scores.ai + (winner === 'ai' ? playerScore : 0),
        }
      };
    }
    return newState;
  }, []);

  const isValidMove = (card: Card) => {
    if (card.rank === '8') return true;
    return card.suit === state.currentSuit || card.rank === state.currentRank;
  };

  const drawCard = (turn: Turn) => {
    if (state.deck.length === 0) {
      setState(prev => ({ 
        ...prev, 
        turn: prev.turn === 'player' ? 'ai' : 'player',
        lastAction: `${turn.toUpperCase()} skipped (No cards in deck)`
      }));
      return;
    }

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const newState = {
        ...prev,
        deck: newDeck,
        [turn === 'player' ? 'playerHand' : 'aiHand']: [...prev[turn === 'player' ? 'playerHand' : 'aiHand'], drawnCard],
        turn: turn === 'player' ? 'ai' : 'player',
        lastAction: `${turn.toUpperCase()} drew a card`
      };
      return checkWinner(newState);
    });
  };

  const playCard = (card: Card, turn: Turn) => {
    if (!isValidMove(card)) return;

    setState(prev => {
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const newDiscardPile = [card, ...prev.discardPile];
      
      let nextStatus = prev.status;
      if (card.rank === '8') {
        if (turn === 'player') {
          nextStatus = 'choosing_suit';
        } else {
          const suitCounts = newHand.reduce((acc, c) => {
            acc[c.suit] = (acc[c.suit] || 0) + 1;
            return acc;
          }, {} as Record<Suit, number>);
          const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || 'hearts';
          
          const newState = {
            ...prev,
            [handKey]: newHand,
            discardPile: newDiscardPile,
            currentSuit: bestSuit,
            currentRank: card.rank,
            turn: 'player' as const,
            lastAction: `AI played 8 and chose ${bestSuit}`
          };
          return checkWinner(newState);
        }
      }

      const newState = {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentRank: card.rank,
        turn: turn === 'player' ? 'ai' : 'player' as const,
        status: nextStatus,
        lastAction: `${turn.toUpperCase()} played ${card.rank} of ${card.suit}`
      };
      
      return checkWinner(newState);
    });
  };

  const selectSuit = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      currentSuit: suit,
      status: 'playing',
      turn: 'ai',
    }));
  };

  // AI Logic
  useEffect(() => {
    if (state.turn === 'ai' && state.status === 'playing' && !state.winner) {
      const timer = setTimeout(() => {
        const playableCard = state.aiHand.find(isValidMove);
        if (playableCard) {
          playCard(playableCard, 'ai');
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, state.winner]);

  const restartGame = () => {
    const deck = shuffle(createDeck());
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = deck.splice(0, INITIAL_HAND_SIZE);
    let firstDiscardIndex = 0;
    while (deck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const discardPile = [deck.splice(firstDiscardIndex, 1)[0]];

    setState(prev => ({
      ...prev,
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentSuit: discardPile[0].suit,
      currentRank: discardPile[0].rank,
      turn: 'player',
      status: 'playing',
      winner: null,
      round: prev.round + 1,
      lastAction: 'New Round Started'
    }));
  };

  return {
    state,
    playCard,
    drawCard,
    selectSuit,
    restartGame,
    isValidMove,
    startGame,
    goHome
  };
};
