"use client";

import { useEffect, useRef } from 'react';
import { useSnakeGame } from '@/hooks/useSnakeGame';

interface SnakeGameProps {
  cellSize?: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ cellSize = 20 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, GRID_SIZE } = useSnakeGame();

  const canvasSize = GRID_SIZE * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#111827'; // Dark background
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid (subtle)
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      0,
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2
    );
    foodGradient.addColorStop(0, '#ef4444'); // red-500
    foodGradient.addColorStop(1, '#dc2626'); // red-600
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head - brighter green with gradient
        const headGradient = ctx.createRadialGradient(
          segment.x * cellSize + cellSize / 2,
          segment.y * cellSize + cellSize / 2,
          0,
          segment.x * cellSize + cellSize / 2,
          segment.y * cellSize + cellSize / 2,
          cellSize / 2
        );
        headGradient.addColorStop(0, '#22c55e'); // green-500
        headGradient.addColorStop(1, '#16a34a'); // green-600
        ctx.fillStyle = headGradient;
      } else {
        // Body - darker green with gradient
        const bodyGradient = ctx.createLinearGradient(
          segment.x * cellSize,
          segment.y * cellSize,
          segment.x * cellSize + cellSize,
          segment.y * cellSize + cellSize
        );
        bodyGradient.addColorStop(0, '#16a34a'); // green-600
        bodyGradient.addColorStop(1, '#15803d'); // green-700
        ctx.fillStyle = bodyGradient;
      }

      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      // Add subtle border
      ctx.strokeStyle = index === 0 ? '#15803d' : '#166534'; // green-700 or green-800
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvasSize / 2, canvasSize / 2 - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.fillText('Press R to restart', canvasSize / 2, canvasSize / 2 + 20);
    }

    // Draw pause overlay
    if (gameState.isPaused && gameState.isPlaying) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvasSize / 2, canvasSize / 2 - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.fillText('Press SPACE to resume', canvasSize / 2, canvasSize / 2 + 20);
    }

    // Draw start screen
    if (!gameState.isPlaying && !gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 42px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE GAME', canvasSize / 2, canvasSize / 2 - 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText('Click START to begin', canvasSize / 2, canvasSize / 2 - 20);

      ctx.font = '16px Arial';
      ctx.fillStyle = '#d1d5db';
      ctx.fillText('Use ARROW KEYS or WASD to move', canvasSize / 2, canvasSize / 2 + 20);
      ctx.fillText('SPACE to pause • R to restart', canvasSize / 2, canvasSize / 2 + 45);
    }
  }, [gameState, canvasSize, cellSize, GRID_SIZE]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border-2 border-gray-700 rounded-lg shadow-2xl bg-gray-900"
      />
    </div>
  );
};