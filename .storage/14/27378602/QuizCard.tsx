import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz } from '@/types';
import { Calendar, FileText, Play, BarChart3 } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quiz: Quiz) => void;
  lastScore?: number;
}

export default function QuizCard({ quiz, onStartQuiz, lastScore }: QuizCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
            {quiz.title}
          </CardTitle>
          {lastScore !== undefined && (
            <Badge 
              variant={lastScore >= 80 ? "default" : lastScore >= 60 ? "secondary" : "destructive"}
              className="ml-2 flex items-center space-x-1"
            >
              <BarChart3 className="h-3 w-3" />
              <span>{lastScore}%</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{quiz.totalQuestions} questions</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(quiz.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            onClick={() => onStartQuiz(quiz)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="mr-2 h-4 w-4" />
            {lastScore !== undefined ? 'Retake Quiz' : 'Start Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}