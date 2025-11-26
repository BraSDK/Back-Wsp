import { useState, useEffect } from 'react'
import { api } from "./api/axios"
import reactLogo from './assets/react.svg'
import { AppRouter } from "./router/AppRouter";
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log("BASE URL:", api.defaults.baseURL);
  }, []);
  
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
