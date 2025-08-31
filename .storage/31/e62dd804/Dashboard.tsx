import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/lib/auth';
import { apiService } from '@/lib/api';
import { User, Quiz, UploadedFile, UserProgress } from '@/types';
import PDFUploader from '@/components/PDFUploader';
import QuizGenerator from '@/components/QuizGenerator';
import QuizCard from '@/components/QuizCard';
import ProgressTracker from '@/components/ProgressTracker';
import { LogOut, Upload, Brain, BarChart3, FileText, Plus, Crown, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    loadUserData();
  }, [navigate]);

  const loadUserData = () => {
    const userQuizzes = apiService.getUserQuizzes();
    const userProgress = apiService.getUserProgress();
    setQuizzes(userQuizzes);
    setProgress(userProgress);
  };

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleUploadComplete = (file: UploadedFile) => {
    setUploadedFile(file);
    setActiveTab('generate');
  };

  const handleQuizGenerated = (quiz: Quiz) => {
    setQuizzes(prev => [quiz, ...prev]);
    setActiveTab('quizzes');
    loadUserData();
  };

  const handleStartQuiz = (quiz: Quiz) => {
    navigate('/quiz', { state: { quiz } });
  };

  const handleNewUpload = () => {
    setUploadedFile(null);
    setActiveTab('upload');
  };

  const handleUpgradeToPremium = () => {
    navigate('/pricing');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">EduAI Platform</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {!user.isPremium && (
                <Button 
                  onClick={handleUpgradeToPremium}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  size="sm"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  {user.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Upgrade Banner for Free Users */}
        {!user.isPremium && (
          <Card className="mb-8 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Crown className="h-8 w-8 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Unlock Premium Features</h3>
                    <p className="text-sm text-gray-600">
                      Get unlimited uploads, advanced analytics, and more with Premium
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleUpgradeToPremium}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        {progress && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>
            <ProgressTracker progress={progress} />
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Generate</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Study Material</h2>
              <p className="text-lg text-gray-600">
                Start by uploading a PDF document to generate interactive learning content
              </p>
              {!user.isPremium && (
                <p className="text-sm text-yellow-600 mt-2">
                  Free users: 3 uploads per month • <button onClick={handleUpgradeToPremium} className="underline">Upgrade for unlimited</button>
                </p>
              )}
            </div>
            <div className="max-w-2xl mx-auto">
              <PDFUploader onUploadComplete={handleUploadComplete} />
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            {uploadedFile ? (
              <div className="max-w-2xl mx-auto">
                <QuizGenerator 
                  uploadedFile={uploadedFile} 
                  onQuizGenerated={handleQuizGenerated}
                />
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Document Uploaded</h3>
                  <p className="text-gray-600 mb-4">
                    Please upload a PDF document first to generate quizzes
                  </p>
                  <Button onClick={handleNewUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Quizzes</h2>
                {!user.isPremium && (
                  <p className="text-sm text-gray-600 mt-1">
                    Free users: 5 quizzes per month • <button onClick={handleUpgradeToPremium} className="text-yellow-600 underline">Upgrade for unlimited</button>
                  </p>
                )}
              </div>
              <Button onClick={handleNewUpload} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Quiz
              </Button>
            </div>
            
            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onStartQuiz={handleStartQuiz}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Quizzes Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a document and generate your first AI-powered quiz
                  </p>
                  <Button onClick={handleNewUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Learning Analytics</h2>
              {!user.isPremium && (
                <Button onClick={handleUpgradeToPremium} size="sm" variant="outline">
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock Advanced Analytics
                </Button>
              )}
            </div>
            
            {progress && progress.completedQuizzes > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Score</span>
                      <span className="text-2xl font-bold text-blue-600">{progress.averageScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quizzes Completed</span>
                      <span className="text-lg font-semibold">{progress.completedQuizzes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Quizzes</span>
                      <span className="text-lg font-semibold">{progress.totalQuizzes}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {progress.strengths.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                        <div className="flex flex-wrap gap-2">
                          {progress.strengths.map((strength, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {progress.weaknesses.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                        <div className="flex flex-wrap gap-2">
                          {progress.weaknesses.map((weakness, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {!user.isPremium && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <Crown className="h-4 w-4 inline mr-1" />
                          Upgrade to Premium for detailed learning insights and progress tracking
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analytics Data</h3>
                  <p className="text-gray-600 mb-4">
                    Complete some quizzes to see your learning analytics
                  </p>
                  <Button onClick={() => setActiveTab('quizzes')}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Quizzes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}