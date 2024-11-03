'use client'
import Header from './components/layout/header'
import Hero from './components/sections/hero'
import Features from './components/sections/features'
import HowItWorks from './components/sections/how-it-works'
import Community from './components/sections/community'
import Footer from './components/layout/footer'
import { GameSection } from './components/sections/GameSection'
import { useEffect, useState } from 'react'
import { GameContractManager } from '@/app/lib/contractUtils'

export default function Home() {
  const [isContractReady, setIsContractReady] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const gameContract = new GameContractManager();
          const price = await gameContract.getGamePrice();
          console.log('Game price:', price, 'AIA');
          setIsContractReady(true);
        } else {
          setContractError('Please install MetaMask to play the game');
        }
      } catch (error) {
        console.error('Contract initialization error:', error);
        setContractError('Failed to initialize game contract');
      }
    };

    initializeContract();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        
        {/* Game Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Play T-Rex Game</h2>
            {contractError ? (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 text-center">
                {contractError}
              </div>
            ) : !isContractReady ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                <span>Initializing game contract...</span>
              </div>
            ) : (
              <GameSection />
            )}
          </div>
        </section>

        <Community />
      </main>
      <Footer />
    </div>
  )
}