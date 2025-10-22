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
    if (playerVal > 21) {
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

  useEffect(() => {
    if (gameOver) {
      const playerVal = handValue(playerHand);
      const dealerVal = handValue(dealerHand);

      let result: 'win' | 'loss' | 'tie' = 'tie';
      if (playerVal <= 21) {
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
    <>
      <h2 className='text-2xl font-bold mb-4'>Like a moth to a flame...</h2>
      <div className='flex center justify-center gap-20 mb-4'>
        <button className='w-20' onClick={onHit}>Hit</button>
        <button className='w-20'  onClick={onStay}>Stay</button>
      </div>
      <div>
        <p>Your Hand ({handValue(playerHand)})</p>
        <p>{playerHand.map(card => `${card.rank} ${card.suit}`).join(", ")}</p>
        {/* apparently dealer is supposed to show playerhandconut -1 cards ?? (wikihow)*/}
        {/* idk bruh i dont even gamble */}
        <p>{message}</p>
        {gameOver ? <div><p> Dealer's hand: {handValue(dealerHand)} </p> <button onClick={onClose}>Okay</button></div> : <></>}
      </div>
    </>
  )
}
export default Gambling