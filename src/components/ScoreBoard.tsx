"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  snakeLength: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  currentScore,
  highScore,
  difficulty,
  snakeLength,
}) => {
  const getDifficultyBadgeColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-600 hover:bg-green-700';
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'hard': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getDifficultyMultiplier = (diff: string) => {
    switch (diff) {
      case 'easy': return '×1';
      case 'medium': return '×2';
      case 'hard': return '×3';
      default: return '×1';
    }
  };

  const isNewHighScore = currentScore > 0 && currentScore >= highScore;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-center text-xl flex items-center justify-center gap-2">
          🏆 Score Board
          <Badge className={getDifficultyBadgeColor(difficulty)}>
            {difficulty.toUpperCase()} {getDifficultyMultiplier(difficulty)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Score */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-400 mb-1">Current Score</div>
          <div className={`text-3xl font-bold transition-colors ${
            isNewHighScore ? 'text-yellow-400 animate-pulse' : 'text-white'
          }`}>
            {currentScore.toLocaleString()}
            {isNewHighScore && (
              <div className="text-xs text-yellow-400 font-normal animate-pulse">
                NEW HIGH SCORE! 🎉
              </div>
            )}
          </div>
        </div>

        {/* High Score */}
        <div className="text-center">
          <div className="text-sm font-medium text-gray-400 mb-1">High Score</div>
          <div className="text-xl font-bold text-amber-400">
            {Math.max(currentScore, highScore).toLocaleString()}
          </div>
        </div>

        {/* Game Stats */}
        <div className="border-t border-gray-700 pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Snake Length</div>
              <div className="text-lg font-bold text-green-400">
                {snakeLength}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Food Eaten</div>
              <div className="text-lg font-bold text-red-400">
                {snakeLength - 3}
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System Info */}
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400 text-center">
            <div className="font-medium text-gray-300 mb-2">Scoring System</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-800 bg-opacity-50 rounded px-2 py-1">
                <div className="text-green-400 font-medium">Easy</div>
                <div>10 pts/food</div>
              </div>
              <div className="bg-yellow-800 bg-opacity-50 rounded px-2 py-1">
                <div className="text-yellow-400 font-medium">Medium</div>
                <div>20 pts/food</div>
              </div>
              <div className="bg-red-800 bg-opacity-50 rounded px-2 py-1">
                <div className="text-red-400 font-medium">Hard</div>
                <div>30 pts/food</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        {currentScore > 0 && (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-400 mb-2">Performance</div>
            <div className="flex justify-center">
              {currentScore >= highScore * 0.9 ? (
                <Badge className="bg-green-600 text-white">🔥 Excellent!</Badge>
              ) : currentScore >= highScore * 0.7 ? (
                <Badge className="bg-yellow-600 text-white">💪 Great!</Badge>
              ) : currentScore >= highScore * 0.5 ? (
                <Badge className="bg-blue-600 text-white">👍 Good!</Badge>
              ) : (
                <Badge className="bg-gray-600 text-white">🎯 Keep Going!</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};