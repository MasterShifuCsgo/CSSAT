import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home.tsx'
import About from '@/pages/About.tsx'
import Contact from '@/pages/Contact.tsx'
import Start from '@/pages/Start.tsx'
import Task from '@/pages/Task.tsx'

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Leaderboard from "@/pages/Leaderboard.tsx";
import MySkills from "@/pages/MySkills.tsx";
import Settings from "@/pages/MySkills.tsx";
import Profile from "@/pages/Profile.tsx";

async function loadPreline() {
  return import('preline/dist/index.js')
}

function App() {
  const location = useLocation()

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline()

      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit()
      }
    }

    initPreline()
  }, [location.pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/start" element={<Start/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/mySkills" element={<MySkills/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/task/:domain/:taskType" element={<Task/>} />
      </Routes>
    </>
  )
}

export default App
