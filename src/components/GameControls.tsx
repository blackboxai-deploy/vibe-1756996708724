"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPlaying,
  isPaused,
  gameOver,
  difficulty,
  onStart,
  onPause,
  onRestart,
  onDifficultyChange,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-center text-xl">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Difficulty Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Difficulty Level</label>
          <Select
            value={difficulty}
            onValueChange={(value: 'easy' | 'medium' | 'hard') => onDifficultyChange(value)}
            disabled={isPlaying && !gameOver}
          >
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
              <SelectValue>
                <span className={getDifficultyColor(difficulty)}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="easy" className="text-green-400 focus:bg-gray-600 focus:text-green-300">
                Easy (Slow)
              </SelectItem>
              <SelectItem value="medium" className="text-yellow-400 focus:bg-gray-600 focus:text-yellow-300">
                Medium (Normal)
              </SelectItem>
              <SelectItem value="hard" className="text-red-400 focus:bg-gray-600 focus:text-red-300">
                Hard (Fast)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Game Action Buttons */}
        <div className="space-y-3">
          {!isPlaying && !gameOver && (
            <Button
              onClick={onStart}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              🎮 Start Game
            </Button>
          )}

          {isPlaying && !gameOver && (
            <Button
              onClick={onPause}
              className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                isPaused 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </Button>
          )}

          <Button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            disabled={!isPlaying && !gameOver}
          >
            🔄 Restart
          </Button>
        </div>

        {/* Controls Instructions */}
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Controls:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>
              <div className="font-medium text-gray-300 mb-1">Movement:</div>
              <div>↑↓←→ Arrow Keys</div>
              <div>WASD Keys</div>
            </div>
            <div>
              <div className="font-medium text-gray-300 mb-1">Actions:</div>
              <div>SPACE - Pause</div>
              <div>R - Restart</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center">
          {gameOver && (
            <div className="text-red-400 font-semibold text-lg animate-pulse">
              Game Over!
            </div>
          )}
          {isPaused && isPlaying && (
            <div className="text-yellow-400 font-semibold text-lg animate-pulse">
              Game Paused
            </div>
          )}
          {isPlaying && !isPaused && !gameOver && (
            <div className="text-green-400 font-semibold text-lg">
              Playing
            </div>
          )}
          {!isPlaying && !gameOver && (
            <div className="text-gray-400 font-semibold text-lg">
              Ready to Start
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};