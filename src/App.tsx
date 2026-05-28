import { useEffect, useState } from 'react'
import { createClient } from "@supabase/supabase-js";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

interface Activity {
  id: number;
  name: string;
  description: string | null;
  helps_eyes: boolean;
  helps_neck: boolean;
  helps_mind: boolean;
  screen_free: boolean;
  icon: string | null;
  created_at: string;
}

function App() {
  const [count, setCount] = useState(0)

  // 2. Tell TypeScript that suggestion can be an Activity OR null
  const [suggestion, setSuggestion] = useState<Activity | null>(null)

  useEffect(() => {
    let ignore = false;

    async function fetchSuggestion() {
      // 3. (Optional but helpful) Tell Supabase what type of data to expect
      const { data: candidates, error } = await supabase
        .from('activities')
        .select('*')
        .eq('helps_eyes', true).returns<Activity[]>();
      if (error) {
        console.error(error);
        return;
      }

      if (!ignore && candidates && candidates.length > 0) {
        setSuggestion(candidates[Math.floor(Math.random() * candidates.length)]);
      }
    }

    fetchSuggestion();

    return () => {
      ignore = true;
    };
  }, []);


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
          <p>Suggestion is: {suggestion && (
            <div className="suggestion-card">
              <h2>{suggestion.icon} {suggestion.name}</h2>
              <p>{suggestion.description}</p>

              <div className="tags">
                {suggestion.helps_eyes && <span>👀 Good for Eyes</span>}
                {suggestion.helps_neck && <span>🦒 Good for Neck</span>}
                {suggestion.screen_free && <span>🚫 No Screens</span>}
              </div>
            </div>
          )}</p>
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
