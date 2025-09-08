import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [balance, setBalance] = useState(0);
  const [time, setTime] = useState(9);

  const friesInTheBag = async () => {
    setBalance(balance + 10);
    setTime(time + 1);
    if(time === 17) setTime(9);
  };

  return (
    <>
      <div>
        <h2>welcome to your new job</h2>
        <button onClick={() => friesInTheBag()}>
          fries
        </button>
        <p>${balance}</p>
        <p>{time}:00</p>
      </div>
    </>
  )
}

export default App
