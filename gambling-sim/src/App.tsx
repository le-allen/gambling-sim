import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const DaysOfWeek = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday"
};

type Day = typeof DaysOfWeek[keyof typeof DaysOfWeek];

function App() {
  const [balance, setBalance] = useState(0);
  const [time, setTime] = useState(9);
  const [day, setDay] = useState<Day>(DaysOfWeek.Monday);

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

  const friesInTheBag = async () => {
    setBalance(balance + 10);
    setTime(time + 1);
    if(time === 17) {
      setTime(9);
      nextDay()
    };
  };

  const gamble = async () => {
    setBalance(balance - 10);
    setTime(time + 1);
    if(time === 17) {
      setTime(9);
      nextDay()
    };
  }

  return (
    <>
      <div>
        <h2 className='text-2xl font-bold mb-4'>welcome to your new job</h2>
        {day == DaysOfWeek.Saturday || day == DaysOfWeek.Sunday ? 
          <div className='flex flex-col items-center gap-2 pt-2 pb-4'>
            <button onClick={() => gamble()}>
              gamble
            </button> 
            <button onClick={() => gamble()}>
              don't gamble
            </button> 
          </div>
        : 
          <button onClick={() => friesInTheBag()}>
            fries
          </button>
        }
        <p>${balance}</p>
        <p>{time}:00</p>
        <p>{day}</p>
      </div>
    </>
  )
}

export default App
