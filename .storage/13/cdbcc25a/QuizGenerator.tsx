import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain, Zap } from 'lucide-react';
import { apiService } from '@/lib/api';
import { Quiz, UploadedFile } from '@/types';
import { toast } from 'sonner';

interface QuizGeneratorProps {
  uploadedFile: UploadedFile;
  onQuizGenerated: (quiz: Quiz) => void;
}

export default function QuizGenerator({ uploadedFile, onQuizGenerated }: QuizGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    
    try {
      const quiz = await apiService.generateQuiz(uploadedFile.id, questionCount);
      onQuizGenerated(quiz);
      toast.success(`Quiz with ${questionCount} questions generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>AI Quiz Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white/80 p-4 rounded-lg border">
          <p className="text-sm text-gray-600 mb-2">Source Document:</p>
          <p className="font-medium text-gray-800">{uploadedFile.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              id="questionCount"
              type="number"
              min="3"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">AI-Powered Generation</h4>
              <p className="text-sm text-blue-600 mt-1">
                Our AI will analyze your document and create engaging questions that test key concepts, 
                definitions, and understanding.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerateQuiz}
          disabled={generating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Quiz
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}