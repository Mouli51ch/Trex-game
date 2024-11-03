// app/components/game/GameControls.tsx
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { GameContractManager } from '@/app/lib/contractUtils';
import { useWallet } from '@/app/lib/hooks/useWallet';

interface GameControlsProps {
    credits: number;
    onCreditsPurchased: () => void;
    onGameStart: () => void;
}

export function GameControls({ credits, onCreditsPurchased, onGameStart }: GameControlsProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { account } = useWallet();
    const [gamePrice, setGamePrice] = useState<string>('0.1'); // Default price

    const handlePurchaseCredits = async () => {
        if (!account) return;
        setLoading(true);
        setError(null);

        try {
            const gameContract = new GameContractManager();
            
            // Get current game price
            const price = await gameContract.getGamePrice();
            setGamePrice(price);

            // Check user's balance
            const balance = await gameContract.getBalance();
            if (parseFloat(balance) < parseFloat(price)) {
                throw new Error(`Insufficient AIA balance. You need at least ${price} AIA`);
            }

            // Purchase credit
            const success = await gameContract.purchaseCredits(1);
            if (success) {
                onCreditsPurchased();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to purchase credits');
            console.error('Purchase error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = async () => {
        if (!account || credits <= 0) return;
        setLoading(true);
        setError(null);

        try {
            const gameContract = new GameContractManager();
            const gameId = await gameContract.startGame();
            if (gameId !== null) {
                onGameStart();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to start game');
            console.error('Start game error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Credits Available: {credits}</p>
                    <p className="text-sm text-gray-500">Price: {gamePrice} AIA per credit</p>
                </div>

                <div className="space-x-2">
                    {credits === 0 ? (
                        <Button
                            onClick={handlePurchaseCredits}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Purchasing...
                                </span>
                            ) : (
                                'Purchase Credit'
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleStartGame}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Starting...
                                </span>
                            ) : (
                                'Start Game'
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {loading && (
                <div className="text-sm text-gray-500 text-center">
                    Please confirm the transaction in your wallet...
                </div>
            )}

            <div className="text-xs text-gray-500">
                {credits === 0 ? (
                    <p>Purchase a credit to play the game. Each credit costs {gamePrice} AIA.</p>
                ) : (
                    <p>You have {credits} credit{credits !== 1 ? 's' : ''} remaining.</p>
                )}
            </div>
        </div>
    );
}