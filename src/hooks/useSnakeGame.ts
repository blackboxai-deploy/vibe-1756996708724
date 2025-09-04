"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const GRID_SIZE = 30;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const INITIAL_DIRECTION: Position = { x: 1, y: 0 };

const DIFFICULTY_SPEEDS = {
  easy: 200,
  medium: 150,
  hard: 100
};

const DIFFICULTY_SCORES = {
  easy: 1,
  medium: 2,
  hard: 3
};

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const getHighScore = (): number => {
  if (typeof window !== 'undefined') {
    return parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
  }
  return 0;
};

const setHighScore = (score: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('snakeHighScore', score.toString());
  }
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: generateFood(INITIAL_SNAKE),
    direction: INITIAL_DIRECTION,
    score: 0,
    gameOver: false,
    isPlaying: false,
    isPaused: false,
    difficulty: 'medium'
  });

  const [highScore, setHighScoreState] = useState<number>(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const lastDirectionRef = useRef<Position>(INITIAL_DIRECTION);

  // Initialize high score
  useEffect(() => {
    setHighScoreState(getHighScore());
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = INITIAL_SNAKE;
    setGameState({
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: INITIAL_DIRECTION,
      score: 0,
      gameOver: false,
      isPlaying: false,
      isPaused: false,
      difficulty: gameState.difficulty
    });
    lastDirectionRef.current = INITIAL_DIRECTION;
  }, [gameState.difficulty]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      gameOver: false
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  const changeDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({
      ...prev,
      difficulty,
      isPlaying: false,
      isPaused: false
    }));
  }, []);

  const changeDirection = useCallback((newDirection: Position) => {
    setGameState(prev => {
      // Prevent reverse direction
      if (
        (newDirection.x === -prev.direction.x && newDirection.y === prev.direction.y) ||
        (newDirection.y === -prev.direction.y && newDirection.x === prev.direction.x)
      ) {
        return prev;
      }
      
      lastDirectionRef.current = newDirection;
      return {
        ...prev,
        direction: newDirection
      };
    });
  }, []);

  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.isPaused || !prev.isPlaying) {
        return prev;
      }

      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };
      
      // Use the last direction to ensure smooth movement
      head.x += lastDirectionRef.current.x;
      head.y += lastDirectionRef.current.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        const finalScore = prev.score;
        if (finalScore > getHighScore()) {
          setHighScore(finalScore);
          setHighScoreState(finalScore);
        }
        return {
          ...prev,
          gameOver: true,
          isPlaying: false
        };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        const finalScore = prev.score;
        if (finalScore > getHighScore()) {
          setHighScore(finalScore);
          setHighScoreState(finalScore);
        }
        return {
          ...prev,
          gameOver: true,
          isPlaying: false
        };
      }

      newSnake.unshift(head);

      // Check food collision
      let newFood = prev.food;
      let newScore = prev.score;
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10 * DIFFICULTY_SCORES[prev.difficulty];
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: lastDirectionRef.current
      };
    });
  }, []);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.gameOver) {
      gameLoopRef.current = setInterval(gameLoop, DIFFICULTY_SPEEDS[gameState.difficulty]);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.gameOver, gameState.difficulty, gameLoop]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          pauseGame();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, changeDirection, pauseGame, resetGame]);

  return {
    gameState,
    highScore,
    startGame,
    resetGame,
    pauseGame,
    changeDifficulty,
    changeDirection,
    GRID_SIZE
  };
};