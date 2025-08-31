import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '@/lib/api';
import { UploadedFile } from '@/types';
import { toast } from 'sonner';

interface PDFUploaderProps {
  onUploadComplete: (file: UploadedFile) => void;
}

export default function PDFUploader({ onUploadComplete }: PDFUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadedFile = await apiService.uploadFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      setUploadedFile(uploadedFile);
      onUploadComplete(uploadedFile);
      
      toast.success('PDF uploaded and processed successfully!');
    } catch (error) {
      toast.error('Failed to upload PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  if (uploadedFile) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-800">{uploadedFile.name}</h3>
              <p className="text-sm text-green-600">
                Uploaded and processed successfully
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`text-center cursor-pointer p-8 rounded-lg transition-colors ${
            isDragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Processing PDF...</p>
                <Progress value={progress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-gray-500">{progress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your PDF here' : 'Upload your study material'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop a PDF file, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Maximum file size: 10MB
                </p>
              </div>
              <Button variant="outline" className="mt-4">
                Choose File
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}