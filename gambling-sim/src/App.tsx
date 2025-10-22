import { useEffect, useState } from 'react'
import './App.css'
import Gambling from './components/Gambling'

const DaysOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday"
};

// combine win/loss/tie history with profit history later
// let history: string[] = [];

let profitHistory: number[] = [];

type Day = typeof DaysOfWeek[keyof typeof DaysOfWeek];

const App: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [time, setTime] = useState(9);
  const [day, setDay] = useState<Day>(DaysOfWeek.Monday);
  const [gambling, setGambling] = useState(false);
  const [gambleAmount, setGambleAmount] = useState(balance);
  // const [profit, setProfit] = useState(0);

  const nextDay = () => {
    switch(day) {
      case DaysOfWeek.Monday:
        setDay(DaysOfWeek.Tuesday);
        break;
      case DaysOfWeek.Tuesday:
        setDay(DaysOfWeek.Wednesday);
        break;
      case DaysOfWeek.Wednesday:
        setDay(DaysOfWeek.Thursday);
        break;
      case DaysOfWeek.Thursday:
        setDay(DaysOfWeek.Friday);
        break;
      case DaysOfWeek.Friday:
        setDay(DaysOfWeek.Saturday);
        break;
      case DaysOfWeek.Saturday:
        setDay(DaysOfWeek.Sunday);
        break;
      case DaysOfWeek.Sunday:
        setDay(DaysOfWeek.Monday);
        break;
    }
  }

  const progressTime = () => {
    setTime(time + 1);
    if(time === 17) {
      setTime(9);
      nextDay();
    };
  }

  const friesInTheBag = () => {
    setBalance(balance + 10);
    progressTime();
  };

  const gamble = () => {
    setGambling(true);
    if(gambleAmount === 0) {
      dontGamble();
    };
    progressTime();
  }

  const dontGamble = () => {
    setGambling(false);
    nextDay();
  }

  const handleGameResult = (result: 'win' | 'loss' | 'tie') => {
    console.log("Game result:", result);
    let multiplier = 0;
    if(result === 'win') {
      multiplier = 2;
    } else if (result === 'loss') {
      multiplier = -1;
    }

    setBalance(balance + (gambleAmount * multiplier));
    nextDay();

    // if(result === 'win') {
    //   setBalance(balance + (gambleAmount*2));
    // } else if (result === 'loss') {
    //   setBalance(balance - (gambleAmount));
    // } 
    // nextDay();

    profitHistory.push(gambleAmount * multiplier);
  }

  const handleGambleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // by default, gamble the whole wallet.
    let value = parseInt(e.target.value);
    if(!isNaN(value)) {
      if(value > balance){
        value = balance;
      }
      setGambleAmount(value);
    } else {
      setGambleAmount(balance);
    }
    console.log("Gamble amount:", gambleAmount);
  }

  useEffect(() => { 
    if(day === DaysOfWeek.Saturday || day === DaysOfWeek.Sunday) {
      setGambleAmount(balance);
    }
  }, [day]);

  return (
    <>
      {gambling === true ? <Gambling onResult={handleGameResult} onClose={() => setGambling(false)}/> :
        <div>
          {day === DaysOfWeek.Saturday || day === DaysOfWeek.Sunday ? 
            <div className='flex flex-col gap-2 pt-2 pb-4'>
              <h2 className='text-2xl font-bold mb-4'>WOOOOOOO</h2>
              <div className='flex flex-row gap-67'>  
                <div>
                  {balance >= 0 ? 
                    <div>
                      <input 
                        type='text' 
                        placeholder='limit?' 
                        onChange={(e) => handleGambleAmountChange(e)}
                        className='w-40 h-8 flex border-4 border-red-500 mb-2' 
                      />
                      <button onClick={() => gamble()} className='w-40 h-20'>
                        gamble
                      </button> 
                    </div>
                    :
                    <p>broke ass mf wanna gamble? LOL</p>
                  }
                  <p>gambling with: {gambleAmount}</p>
                </div>
                <button onClick={() => dontGamble()}  className='w-40 h-20'>
                  don't gamble
                </button> 
              </div>
            </div>
          : 
            <div className='flex flex-col items-center gap-2 pt-2 pb-4'>  
              <h2 className='text-2xl font-bold mb-4'>welcome to your new job</h2>
              <button onClick={() => friesInTheBag()} className='w-40 h-20'>
                put the fries in the bag
              </button>
            </div>
          }
          <div>
            <p>${balance}</p>
            <p>{time}:00</p>
            <p>{day}</p>
            <p>{profitHistory.map(gameResult => gameResult).join(", ")}</p>
          </div>
        </div>
      }
    </>
  )
}

export default App
