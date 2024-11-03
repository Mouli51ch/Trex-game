import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TrexGameProps {
    isActive: boolean;
    onGameOver: (score: number) => void;
}

interface Obstacle {
    x: number;
    width: number;
    height: number;
}

// Game constants
const INITIAL_POSITION = 100;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MIN_OBSTACLE_DISTANCE = 300;
const INITIAL_GAME_SPEED = 5;
const MAX_GAME_SPEED = 12;
const GAME_TICK = 20; // ms
const SCORE_TICK = 100; // ms

export function TrexGame({ isActive, onGameOver }: TrexGameProps) {
    // Game state
    const [position, setPosition] = useState<number>(INITIAL_POSITION);
    const [isJumping, setIsJumping] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [gameSpeed, setGameSpeed] = useState<number>(INITIAL_GAME_SPEED);

    // Refs for intervals
    const gameRef = useRef<NodeJS.Timer | null>(null);
    const scoreRef = useRef<NodeJS.Timer | null>(null);

    // Jump handler
    const jump = useCallback(() => {
        if (!isJumping && isActive) {
            setIsJumping(true);
            setPosition(prev => prev + JUMP_FORCE);
        }
    }, [isJumping, isActive]);

    // Keyboard input handler
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space' || event.key === 'ArrowUp') {
                event.preventDefault();
                jump();
            }
        };

        if (isActive) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [jump, isActive]);

    // Touch input handler
    useEffect(() => {
        const handleTouch = (event: TouchEvent) => {
            event.preventDefault();
            jump();
        };

        if (isActive) {
            window.addEventListener('touchstart', handleTouch);
        }

        return () => {
            window.removeEventListener('touchstart', handleTouch);
        };
    }, [jump, isActive]);

    // Main game loop
    useEffect(() => {
        if (!isActive) {
            if (gameRef.current) clearInterval(gameRef.current);
            if (scoreRef.current) clearInterval(scoreRef.current);
            return;
        }

        const gameLoop = setInterval(() => {
            // Update position (gravity)
            setPosition(prevPosition => {
                if (prevPosition < INITIAL_POSITION || isJumping) {
                    const newPosition = prevPosition + GRAVITY;
                    if (newPosition > INITIAL_POSITION) {
                        setIsJumping(false);
                        return INITIAL_POSITION;
                    }
                    return newPosition;
                }
                return prevPosition;
            });

            // Update obstacles
            setObstacles(prevObstacles => {
                // Move existing obstacles
                const updatedObstacles = prevObstacles
                    .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
                    .filter(obs => obs.x > -50);

                // Add new obstacle if needed
                const lastObstacle = updatedObstacles[updatedObstacles.length - 1];
                if (!lastObstacle || lastObstacle.x < 400 - MIN_OBSTACLE_DISTANCE) {
                    if (Math.random() < 0.02) {
                        updatedObstacles.push({
                            x: 800,
                            width: 20 + Math.random() * 30,
                            height: 40 + Math.random() * 20
                        });
                    }
                }

                return updatedObstacles;
            });

            // Collision detection
            const playerRect = {
                x: 50,
                y: position,
                width: 20,
                height: 40
            };

            const collision = obstacles.some(obs => (
                playerRect.x < obs.x + obs.width &&
                playerRect.x + playerRect.width > obs.x &&
                playerRect.y + playerRect.height > INITIAL_POSITION - obs.height
            ));

            if (collision) {
                if (gameRef.current) clearInterval(gameRef.current);
                if (scoreRef.current) clearInterval(scoreRef.current);
                onGameOver(score);
            }
        }, GAME_TICK);

        // Score counter
        const scoreCounter = setInterval(() => {
            setScore(prev => prev + 1);
            // Increase game speed over time
            setGameSpeed(prev => Math.min(prev + 0.001, MAX_GAME_SPEED));
        }, SCORE_TICK);

        gameRef.current = gameLoop;
        scoreRef.current = scoreCounter;

        return () => {
            clearInterval(gameLoop);
            clearInterval(scoreCounter);
        };
    }, [isActive, isJumping, obstacles, position, score, gameSpeed, onGameOver]);

    return (
        <div className="relative w-full h-64 bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden rounded-lg border-2 border-gray-300">
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-1 bg-gray-800" />

            {/* Player */}
            <div
                className="absolute w-5 h-10 bg-black rounded transition-transform"
                style={{
                    bottom: `${position}px`,
                    left: '50px',
                    transform: `rotate(${isJumping ? '-15deg' : '0deg'})`
                }}
            />

            {/* Obstacles */}
            {obstacles.map((obstacle, index) => (
                <div
                    key={index}
                    className="absolute bg-red-500 rounded"
                    style={{
                        bottom: '0px',
                        left: `${obstacle.x}px`,
                        width: `${obstacle.width}px`,
                        height: `${obstacle.height}px`
                    }}
                />
            ))}

            {/* Score */}
            <div className="absolute top-4 right-4 text-2xl font-bold text-gray-800">
                Score: {score}
            </div>

            {/* Game Instructions */}
            {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    <div className="text-center p-4 bg-gray-800 rounded-lg bg-opacity-75">
                        <p className="text-xl mb-2">Press Space or Tap to Jump</p>
                        <p className="text-sm opacity-75">Avoid the obstacles to score points!</p>
                    </div>
                </div>
            )}
        </div>
    );
}