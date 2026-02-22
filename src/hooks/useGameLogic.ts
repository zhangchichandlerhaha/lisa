
import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, Suit, Rank, Turn } from '../types';
import { createDeck, shuffle, INITIAL_HAND_SIZE, SUITS } from '../constants';

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>(() => {
    const deck = shuffle(createDeck());
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = deck.splice(0, INITIAL_HAND_SIZE);
    
    // Initial discard must not be an 8 for simplicity in first turn
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
      status: 'playing',
      winner: null,
    };
  });

  const checkWinner = useCallback((newState: GameState) => {
    if (newState.playerHand.length === 0) {
      return { ...newState, status: 'game_over' as const, winner: 'player' as const };
    }
    if (newState.aiHand.length === 0) {
      return { ...newState, status: 'game_over' as const, winner: 'ai' as const };
    }
    return newState;
  }, []);

  const isValidMove = (card: Card) => {
    if (card.rank === '8') return true;
    return card.suit === state.currentSuit || card.rank === state.currentRank;
  };

  const drawCard = (turn: Turn) => {
    if (state.deck.length === 0) {
      // Skip turn if deck is empty
      setState(prev => ({ ...prev, turn: prev.turn === 'player' ? 'ai' : 'player' }));
      return;
    }

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const newState = {
        ...prev,
        deck: newDeck,
        [turn === 'player' ? 'playerHand' : 'aiHand']: [...prev[turn === 'player' ? 'playerHand' : 'aiHand'], drawnCard],
        turn: turn === 'player' ? 'ai' : 'player'
      };
      return newState;
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
          // AI logic for choosing suit (most frequent suit in hand)
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

    setState({
      deck,
      playerHand,
      aiHand,
      discardPile,
      currentSuit: discardPile[0].suit,
      currentRank: discardPile[0].rank,
      turn: 'player',
      status: 'playing',
      winner: null,
    });
  };

  return {
    state,
    playCard,
    drawCard,
    selectSuit,
    restartGame,
    isValidMove
  };
};
