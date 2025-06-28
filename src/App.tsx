import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Portfolio from './components/Portfolio'
import Travel from './components/Travel'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Navigation from './components/Navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './App.css'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
    })
  }, [])

  return (
    <div className="App">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Travel />
        <Blog />
        <Contact />
      </motion.div>
      
      {/* Parallax background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            y: [0, -50, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl absolute top-1/4 left-1/4"></div>
        </motion.div>
        
        <motion.div
          className="absolute top-0 right-0 w-full h-full opacity-10"
          animate={{
            y: [0, 50, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl absolute top-3/4 right-1/4"></div>
        </motion.div>
      </div>
    </div>
  )
}

export default App
