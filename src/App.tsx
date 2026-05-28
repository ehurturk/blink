import { useEffect, useState } from 'react'
import { createClient } from "@supabase/supabase-js";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [count, setCount] = useState(0)
  const [suggestion, setSuggestion] = useState(null)

  useEffect(() => {
    getSuggestion();
  }, []);

  async function getSuggestion() {
    const { data: candidates, error } = await supabase
      .from('activities')
      .select('*')
      .eq('helps_eyes', true);

    if (error) {
      console.error(error);
      return;
    }

    setSuggestion(candidates[Math.floor(Math.random() * candidates.length)]);


  }
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>SerGio Nanuk</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
          <p>Suggestion is: {suggestion?.name ?? 'loading...'}</p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
