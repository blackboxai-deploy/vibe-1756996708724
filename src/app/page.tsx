"use client";

import React, { useState, useEffect } from 'react';
import { SnakeGame } from '@/components/SnakeGame';
import { GameControls } from '@/components/GameControls';
import { ScoreBoard } from '@/components/ScoreBoard';
import { GameOverModal } from '@/components/GameOverModal';
import { useSnakeGame } from '@/hooks/useSnakeGame';

export default function HomePage() {
  const {
    gameState,
    highScore,
    startGame,
    resetGame,
    pauseGame,
    changeDifficulty,
  } = useSnakeGame();

  const [showGameOverModal, setShowGameOverModal] = useState(false);

  // Show game over modal when game ends
  useEffect(() => {
    if (gameState.gameOver) {
      const timer = setTimeout(() => {
        setShowGameOverModal(true);
      }, 500); // Small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [gameState.gameOver]);

  const handleRestart = () => {
    setShowGameOverModal(false);
    resetGame();
  };

  const handleCloseModal = () => {
    setShowGameOverModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-wider">
          🐍 SNAKE GAME
        </h1>
        <p className="text-gray-400 text-lg">
          Classic Snake Game with Modern Styling
        </p>
      </div>

      {/* Main Game Container */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 px-4 pb-8">
        {/* Left Side - Game Controls */}
        <div className="order-2 lg:order-1">
          <GameControls
            isPlaying={gameState.isPlaying}
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
            difficulty={gameState.difficulty}
            onStart={startGame}
            onPause={pauseGame}
            onRestart={resetGame}
            onDifficultyChange={changeDifficulty}
          />
        </div>

        {/* Center - Game Canvas */}
        <div className="order-1 lg:order-2 flex justify-center">
          <SnakeGame cellSize={20} />
        </div>

        {/* Right Side - Score Board */}
        <div className="order-3 lg:order-3">
          <ScoreBoard
            currentScore={gameState.score}
            highScore={highScore}
            difficulty={gameState.difficulty}
            snakeLength={gameState.snake.length}
          />
        </div>
      </div>

      {/* Game Instructions Footer */}
      <div className="text-center py-8 border-t border-gray-700 bg-gray-800 bg-opacity-50">
        <h3 className="text-white font-semibold mb-4 text-lg">How to Play</h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-white font-medium mb-2">Objective</h4>
            <p className="text-gray-400 text-sm">
              Guide your snake to eat the red food and grow longer. Avoid hitting walls or yourself!
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⌨️</div>
            <h4 className="text-white font-medium mb-2">Controls</h4>
            <p className="text-gray-400 text-sm">
              Use Arrow Keys or WASD to move. Press SPACE to pause and R to restart the game.
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="text-white font-medium mb-2">Scoring</h4>
            <p className="text-gray-400 text-sm">
              Earn more points on harder difficulties: Easy (10pts), Medium (20pts), Hard (30pts).
            </p>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOverModal}
        score={gameState.score}
        highScore={highScore}
        difficulty={gameState.difficulty}
        snakeLength={gameState.snake.length}
        onRestart={handleRestart}
        onClose={handleCloseModal}
      />
    </div>
  );
}