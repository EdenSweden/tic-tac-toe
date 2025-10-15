import { useState, useRef } from 'react'
import './App.css'

type Square = {
  id: number;
  value: string;
  combos: number[][];
  disabled: boolean;
};


const squaresInitState: Square[] = [{
    id: 0,
    value: '',
    combos: [[1,2],[4,8],[3,6]],
    disabled: false
  },
  {
    id: 1,
    value: '',
    combos: [[4,7]],
    disabled: false
  },
  {
    id: 2,
    value: '',
    combos: [[0,1],[4,6],[5,8]],
    disabled: false
  },
  {
    id: 3,
    value: '',
    combos: [[0,6], [4,5]],
    disabled: false
  },
  {
    id: 4,
    value: '',
    combos: [[0,8],[1,7],[2,6],[3,5],[1,7]],
    disabled: false
  },
  {
    id: 5,
    value: '',
    combos: [[2,8],[3,4]],
    disabled: false
  },
  {
    id: 6,
    value: '',
    combos: [[0,3],[2,4],[7,8]],
    disabled: false
  },
  {
    id: 7,
    value: '',
    combos: [[6,8],[2,5]],
    disabled: false
  },
  {
    id : 8,
    value: '',
    combos: [[0,4],[2,5],[6,7]],
    disabled: false
  }];

function App() {

  const [whoWon, setWhoWon] = useState<string>('');
  const numTurnsRef = useRef<number>(0);
  const [whoseTurnIsIt, setWhoseTurnIsIt] = useState<string>('X');
  const [squares, setSquares] = useState<Square[]>(squaresInitState);

const toggleTurn: () => void = () => {
    setWhoseTurnIsIt(whoseTurnIsIt === 'X' ? 'O' : 'X');
  }

const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  let index = Number(e.currentTarget.id);
  setSquares((prevState: Square[]) => ([...prevState.slice(0, index), {...prevState[index], disabled: true, value: whoseTurnIsIt}, ...prevState.slice(index + 1, 9)]));
  numTurnsRef.current++;
  if (numTurnsRef.current >= 5){
    checkForWinner(index, whoseTurnIsIt);
  }
  toggleTurn();
  }

  const checkForWinner = (latestClickedId: number, whoseTurn: string) => {
    if (!squares.find(s => Number(s.id) !== latestClickedId && s.value === '')) {
      setWhoWon('tie');
    }
    let latestClicked = squares[latestClickedId];
    latestClicked.combos.forEach((combo: number[]) => {
      if (squares[combo[0]].value === whoseTurn && squares[combo[1]].value === whoseTurn){
        setWhoWon(whoseTurn);
        disableAllSquares();
      }
    })
  }

const disableAllSquares = () => {
  setSquares(prevState => prevState.map(a => ({...a, disabled: true})));
}


const reset: () => void = () => {
    setSquares(squaresInitState);
    setWhoseTurnIsIt('X');
    numTurnsRef.current = 0;
    setWhoWon('');
  }

  return (
    <div className='flex justify-center items-center h-screen bg-blue-200 dark:bg-gray-800 dark:text-blue-400 font-sans'>
      <div id='background-box' className='ring-3 ring-violet-700 dark:ring-white dark:ring-1 bg-linear-to-r from-indigo-400 to-violet-400 dark:from-blue-700 dark:to-blue-900  p-15 flex flex-col justify-center items-center gap-10 rounded-xl w-fit md:min-w-[455px]'>
        {whoWon === '' && <h1 className='text-5xl mb-5 w-full'>{`Next player: ${whoseTurnIsIt}`}</h1>}
        {whoWon && <h1 className='text-5xl mb-5 text-center'>{whoWon === 'tie' ? 'It\'s a tie!': `${whoWon} won!`}</h1>}
          <div id='container' className='grid grid-cols-3 grid-rows-3 gap-3'>
            {squares.map(square => (<button className='square cursor-pointer rounded-lg text-center p-0 text-5xl bg-gray-100 dark:bg-gray-800 h-24 w-24 hover:ring-4 hover:ring-fuchsia-600 disabled:ring-0 disabled:cursor-default font-[cursive]'
            id={square.id.toString()}
            key={square.id}
            onClick={handleClick}
            disabled={square.disabled}
            >{square.value}
            </button>))}
          </div>
        <button className='cursor-pointer rounded-lg p-5 bg-gray-200 dark:bg-gray-800 hover:ring-4 hover:ring-fuchsia-600 text-xl' id='reset' onClick={reset}>Reset board</button>
    </div>
  </div>
  )
}

export default App
