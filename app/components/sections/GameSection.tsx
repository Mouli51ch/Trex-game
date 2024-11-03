'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { TrexGame } from '../game/TrexGame';
import { Button } from "@/app/components/ui/button";
import { useState } from 'react';
import { useWeb3 } from "@/app/providers/Web3Provider";

export function GameSection() {
  const [credits, setCredits] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account, gameContract, connectWallet } = useWeb3();

  const handlePurchaseCredits = async () => {
    if (!gameContract) return;
    setIsLoading(true);
    setError(null);

    try {
      const success = await gameContract.purchaseCredits(1);
      if (success) {
        setCredits(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Failed to purchase credits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameStart = async () => {
    if (!gameContract) return;
    setIsLoading(true);
    setError(null);

    try {
      const gameId = await gameContract.startGame();
      if (gameId !== null) {
        setCredits(prev => prev - 1);
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error('Game start error:', err);
      setError(err.message || 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameOver = async (score: number) => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>T-Rex Runner Game</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}

        {!account ? (
          <div className="text-center py-8">
            <Button onClick={connectWallet} disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect Wallet to Play'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p>Credits: {credits}</p>
                <p>High Score: {highScore}</p>
              </div>
              {!isPlaying && (
                credits === 0 ? (
                  <Button onClick={handlePurchaseCredits} disabled={isLoading}>
                    {isLoading ? 'Purchasing...' : 'Purchase Credit'}
                  </Button>
                ) : (
                  <Button onClick={handleGameStart} disabled={isLoading}>
                    {isLoading ? 'Starting...' : 'Start Game'}
                  </Button>
                )
              )}
            </div>

            <TrexGame
              isActive={isPlaying}
              onGameOver={handleGameOver}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}