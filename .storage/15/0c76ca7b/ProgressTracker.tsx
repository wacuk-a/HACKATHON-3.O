import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProgress } from '@/types';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress;
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  const completionRate = progress.totalQuizzes > 0 
    ? Math.round((progress.completedQuizzes / progress.totalQuizzes) * 100)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quiz Completion</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{progress.completedQuizzes}/{progress.totalQuizzes}</div>
            <Progress value={completionRate} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {completionRate}% completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${getScoreColor(progress.averageScore)}`}>
              {progress.averageScore}%
            </div>
            <Badge variant={getScoreBadgeVariant(progress.averageScore)} className="text-xs">
              {progress.averageScore >= 80 ? 'Excellent' : 
               progress.averageScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{Math.round(progress.totalTimeSpent / 60) || 0}m</div>
            <p className="text-xs text-muted-foreground">
              Total study time
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {progress.strengths.length > 0 ? (
              <div>
                <p className="text-xs text-green-600 font-medium">Strengths:</p>
                <div className="flex flex-wrap gap-1">
                  {progress.strengths.map((strength, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-green-700 border-green-200">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : progress.weaknesses.length > 0 ? (
              <div>
                <p className="text-xs text-red-600 font-medium">Focus Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {progress.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-red-700 border-red-200">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Complete more quizzes for insights</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}