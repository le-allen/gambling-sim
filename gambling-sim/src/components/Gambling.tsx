import React, { useEffect, useState } from 'react'

interface GamblingProps {
  onResult?: (result: 'win' | 'loss' | 'tie') => void;
  onClose?: () => void;
}

type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
  rank: Rank;
  suit: Suit;
}
const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const suitSymbol: Record<Suit, string> = {
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
  Spades: '♠',
};

const suitClass: Record<Suit, string> = {
  Hearts: 'text-rose-400',
  Diamonds: 'text-rose-400',
  Clubs: 'text-slate-100',
  Spades: 'text-slate-100',
};

const getCardValue = (rank: Rank): number => {
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  if (rank === 'A') return 11; 
  return parseInt(rank, 10);
};

const handValue = (hand: Card[]) => {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    total += getCardValue(card.rank);
    if (card.rank === 'A') aces += 1;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
};

const createDeck = (): Card[] => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  console.log("Deck Generated: ", deck);
  return deck;
};

const Gambling: React.FC<GamblingProps> = ({ onResult, onClose }) => {  
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  const startGame = () => {
    const newDeck = createDeck();
    const playerStart: Card[] = [newDeck.pop()!, newDeck.pop()!];
    const dealerStart: Card[] = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(playerStart);
    setDealerHand(dealerStart);
    setGameOver(false);
  };

  const onHit = () => {
    if (gameOver) return;
    const newDeck = [...deck];
    const card = newDeck.pop();
    if (!card) return;
    const newHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newHand);
  }

  const onStay = () => {
    if (gameOver) return;
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];
    while (handValue(newDealerHand) < 17) {
      const card = newDeck.pop();
      if (!card) break;
      newDealerHand.push(card);
    }
    setDeck(newDeck);
    setDealerHand(newDealerHand);
    setGameOver(true);
  };

  useEffect(() => {
    const playerVal = handValue(playerHand);
    if (playerVal >= 21) {
      setGameOver(true);
    }
  }, [playerHand, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const dealerVal = handValue(dealerHand);
    if (dealerVal > 21) {
      setGameOver(true);
    }
  }, [dealerHand, gameOver]);

  // what happens if dealer gets 21
  useEffect(() => {
    if (gameOver) {
      const playerVal = handValue(playerHand);
      const dealerVal = handValue(dealerHand);

      let result: 'win' | 'loss' | 'tie' = 'tie';
      if (playerVal === 21) {
        result = 'win';
        setMessage('MAX WIN!');
      } else if (playerVal < 21) {
        if (dealerVal > 21) {
          result = 'win';
          setMessage('MAX WIN!');
        } else if (dealerVal > playerVal) {
          result = 'loss';
          setMessage('You lose.');
        } else if (dealerVal < playerVal) {
          result = 'win';
          setMessage('MAX WIN!');
        }
      } else if (playerVal > 21) {
        result = 'loss';
        setMessage('You busted!');
      } else {
        setMessage('Tie.');
      }
      if (onResult) onResult(result);
    }
  }, [gameOver, dealerHand, playerHand]);


  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className='w-full max-w-3xl rounded-2xl border border-emerald-400/20 bg-gradient-to-b from-emerald-900/40 to-slate-950/80 p-6 shadow-2xl'>
      <h2 className='mb-1 text-3xl font-extrabold tracking-tight'>Blackjack Table</h2>
      <p className='mb-5 text-sm text-emerald-100/80'>Like a moth to a flame...</p>

      <div className='mb-5 grid grid-cols-2 gap-3'>
        <button
          className='h-11 rounded-lg bg-emerald-500 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onHit}
          disabled={gameOver}
        >
          Hit
        </button>
        <button
          className='h-11 rounded-lg border border-white/20 bg-slate-900/60 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onStay}
          disabled={gameOver}
        >
          Stay
        </button>
      </div>

      <div className='space-y-4'>
        <div className='rounded-xl border border-white/10 bg-black/30 p-4 text-left'>
          <p className='text-xs uppercase tracking-wide text-slate-400'>Your Hand</p>
          <p className='mb-2 text-lg font-bold'>{handValue(playerHand)}</p>
          <div className='flex flex-wrap gap-2'>
            {playerHand.map((card, index) => (
              <span key={`${card.rank}-${card.suit}-${index}`} className='rounded-md border border-white/15 bg-slate-900 px-2 py-1 text-sm'>
                <span className='font-semibold'>{card.rank}</span>{' '}
                <span className={suitClass[card.suit]}>{suitSymbol[card.suit]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* apparently dealer is supposed to show playerhandconut -1 cards ?? (wikihow)*/}
        {/* idk bruh i dont even gamble */}
        <p className='min-h-6 text-sm font-medium text-amber-200'>{message}</p>

        {gameOver ? (
          <div className='rounded-xl border border-white/10 bg-black/30 p-4 text-left'>
            <p className='text-xs uppercase tracking-wide text-slate-400'>Dealer Hand</p>
            <p className='mb-2 text-lg font-bold'>{handValue(dealerHand)}</p>
            <div className='mb-4 flex flex-wrap gap-2'>
              {dealerHand.map((card, index) => (
                <span key={`${card.rank}-${card.suit}-${index}`} className='rounded-md border border-white/15 bg-slate-900 px-2 py-1 text-sm'>
                  <span className='font-semibold'>{card.rank}</span>{' '}
                  <span className={suitClass[card.suit]}>{suitSymbol[card.suit]}</span>
                </span>
              ))}
            </div>
            <button onClick={onClose} className='h-10 rounded-lg bg-indigo-500 px-4 font-semibold text-white transition hover:bg-indigo-400'>
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default Gambling