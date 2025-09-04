"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  snakeLength: number;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  difficulty,
  snakeLength,
  onRestart,
  onClose,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;
  const foodEaten = snakeLength - 3;

  const getPerformanceMessage = () => {
    if (isNewHighScore) return { text: "🎉 NEW HIGH SCORE!", color: "text-yellow-400" };
    if (score >= highScore * 0.9) return { text: "🔥 Almost There!", color: "text-orange-400" };
    if (score >= highScore * 0.7) return { text: "💪 Great Job!", color: "text-green-400" };
    if (score >= highScore * 0.5) return { text: "👍 Good Effort!", color: "text-blue-400" };
    return { text: "🎯 Keep Practicing!", color: "text-gray-400" };
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const performanceMessage = getPerformanceMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-400 mb-4">
            🐍 GAME OVER
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Performance Message */}
          <div className="text-center">
            <div className={`text-xl font-bold ${performanceMessage.color} mb-2`}>
              {performanceMessage.text}
            </div>
            {isNewHighScore && (
              <div className="text-sm text-yellow-300 animate-pulse">
                You've set a new record! 🏆
              </div>
            )}
          </div>

          {/* Score Summary */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400 mb-1">Final Score</div>
                <div className="text-2xl font-bold text-white">
                  {score.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">High Score</div>
                <div className="text-2xl font-bold text-amber-400">
                  {Math.max(score, highScore).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-center mb-3">
              <Badge className={`${getDifficultyColor(difficulty)} text-white`}>
                {difficulty.toUpperCase()} MODE
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400 mb-1">Snake Length</div>
                <div className="text-lg font-bold text-green-400">
                  {snakeLength}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Food Eaten</div>
                <div className="text-lg font-bold text-red-400">
                  {foodEaten}
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex justify-center flex-wrap gap-2">
            {score >= 500 && (
              <Badge className="bg-purple-600">🌟 Score Master</Badge>
            )}
            {snakeLength >= 20 && (
              <Badge className="bg-blue-600">🐍 Long Snake</Badge>
            )}
            {difficulty === 'hard' && score > 100 && (
              <Badge className="bg-red-600">⚡ Speed Demon</Badge>
            )}
            {isNewHighScore && (
              <Badge className="bg-yellow-600 animate-pulse">🏆 Record Breaker</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onRestart();
                onClose();
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              🎮 Play Again
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 py-3"
            >
              📊 View Stats
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center text-xs text-gray-500">
            <div>💡 Tip: Try a higher difficulty for more points!</div>
            <div className="mt-1">Use WASD or Arrow keys to move • SPACE to pause • R to restart</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};