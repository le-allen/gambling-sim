import { useEffect, useState } from 'react'
import './App.css'
import Gambling from './components/Gambling.tsx'

const DaysOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday"
};

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
        <div className='w-full max-w-3xl rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur'>
          {day === DaysOfWeek.Saturday || day === DaysOfWeek.Sunday ? 
            <div className='flex flex-col gap-4 pt-2 pb-4'>
              <h2 className='text-3xl font-extrabold tracking-tight'>Casino</h2>
              <p className='text-sm text-slate-300'>WINNERS WIN BABY</p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4'>
                  {balance >= 0 ? 
                    <div className='flex flex-col items-center gap-3'>
                      <input 
                        type='text' 
                        placeholder='limit?' 
                        onChange={(e) => handleGambleAmountChange(e)}
                        className='h-10 w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30' 
                      />
                      <button onClick={() => gamble()} className='h-12 w-full rounded-lg bg-emerald-500 font-semibold text-black transition hover:bg-emerald-400'>
                        Start Gambling
                      </button> 
                    </div>
                    :
                    <p className='text-sm text-rose-300'>No balance left. Work a shift before gambling again.</p>
                  }
                  <p className='mt-3 text-sm text-slate-300'>Gambling with: <span className='font-semibold text-white'>${gambleAmount}</span></p>
                </div>
                <div className='flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/50 p-4'>
                  <button onClick={() => dontGamble()} className='h-12 w-full rounded-lg border border-white/20 bg-slate-800 font-semibold text-white transition hover:bg-slate-700'>
                    Skip Gambling
                  </button>
                </div>
              </div>
            </div>
          : 
            <div className='flex flex-col items-center gap-4 pt-2 pb-4'>
              <h2 className='text-3xl font-extrabold tracking-tight'>Weekday</h2>
              <p className='text-sm text-slate-300'>Clock in 😪</p>
              <button onClick={() => friesInTheBag()} className='h-12 w-64 rounded-lg bg-amber-400 font-semibold text-black transition hover:bg-amber-300'>
                Put the fries in the bag
              </button>
            </div>
          }
          <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='rounded-lg border border-white/10 bg-slate-900/50 p-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>Balance</p>
              <p className='text-xl font-bold text-emerald-300'>${balance}</p>
            </div>
            <div className='rounded-lg border border-white/10 bg-slate-900/50 p-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>Time</p>
              <p className='text-xl font-bold'>{time}:00</p>
            </div>
            <div className='rounded-lg border border-white/10 bg-slate-900/50 p-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>Day</p>
              <p className='text-xl font-bold'>{day}</p>
            </div>
          </div>
          <div className='rounded-lg border border-white/10 bg-slate-900/40 p-3'>
            <p className='mb-2 text-xs uppercase tracking-wide text-slate-400'>Recent Profit History</p>
            <p className='text-sm text-slate-200'>{profitHistory.length > 0 ? profitHistory.join(', ') : 'No games yet.'}</p>
          </div>
        </div>
      }
    </>
  )
}

export default App
