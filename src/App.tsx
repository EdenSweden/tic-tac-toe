import { useState, useRef, useEffect } from 'react'
import './App.css'
import { ThemeSwitcher } from './components/ui/shadcn-io/theme-switcher';

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
  const [theme, setTheme] = useState<'light'|'dark'|'system'>(localStorage.getItem('selectedTheme') as 'light'|'dark'|'system'  || 'system');
  const [isDark, setIsDark] = useState<boolean>(localStorage.getItem('selectedTheme') === 'dark' || (localStorage.getItem('selectedTheme') === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));

  useEffect(() => {
    localStorage.setItem('selectedTheme', theme);
    if (theme === 'dark') {
      setIsDark(true);
    } else if (theme === 'light') {
      setIsDark(false);
    } else if (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      setIsDark(true);
    }

  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return;
    const updateDarkStateAutomatically = (e: MediaQueryListEvent) => {
      setIsDark(e.matches ? true : false);
    }
    if (theme === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDarkStateAutomatically);
    }
    
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateDarkStateAutomatically);
  }, [theme])

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
    <div className={`${isDark ?'dark ' : ''}flex justify-center items-center h-screen bg-blue-200 dark:bg-gray-800 font-sans relative`}>
      <ThemeSwitcher className='md:scale-100 scale-125 absolute bottom-4 right-7 md:top-5 md:bottom-0 md:right-15' defaultValue='system' value={theme} onChange={setTheme} />
      <div id='background-box' className='ring-3 ring-violet-700 dark:ring-white dark:ring-1 bg-linear-to-r from-indigo-400 to-violet-400 dark:from-blue-700 dark:to-blue-900 md:p-15 flex flex-col justify-center items-center gap-10 md:rounded-xl w-full h-full md:h-auto md:w-fit md:min-w-[455px]'>
        {whoWon === '' && <h1 className='md:text-left text-center text-5xl mb-5 w-full dark:text-white'>{`Next player: ${whoseTurnIsIt}`}</h1>}
        {whoWon && <h1 className='text-5xl mb-5 text-center dark:text-white'>{whoWon === 'tie' ? 'It\'s a tie!': `${whoWon} won!`}</h1>}
          <div id='container' className='grid grid-cols-3 grid-rows-3 gap-3'>
            {squares.map(square => (<button className='square cursor-pointer rounded-lg text-center p-0 text-5xl bg-gray-100 h-24 w-24 hover:ring-4 hover:ring-fuchsia-600 disabled:ring-0 disabled:cursor-default font-[cursive]'
            id={square.id.toString()}
            key={square.id}
            onClick={handleClick}
            disabled={square.disabled}
            >{square.value}
            </button>))}
          </div>
        <button className='cursor-pointer rounded-lg p-5 bg-gray-200 hover:ring-4 hover:ring-fuchsia-600 text-xl' id='reset' onClick={reset}>Reset board</button>
    </div>
  </div>
  )
}

export default App
