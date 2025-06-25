
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Calendar, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  timePeriod: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
}

export function PdfUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTimePeriod = (filename: string): string => {
    // Extract date pattern from filename like "[COMPANY LIGHTS] June 14, 2025 - June 20, 2025"
    const datePattern = /(\w+\s+\d+,\s+\d+\s+-\s+\w+\s+\d+,\s+\d+)/;
    const match = filename.match(datePattern);
    return match ? match[1] : 'Unknown period';
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf') {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          timePeriod: extractTimePeriod(file.name),
          uploadDate: new Date().toLocaleDateString(),
          status: 'processing'
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate PDF processing
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id 
                ? { ...f, status: 'completed' }
                : f
            )
          );
        }, 2000);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            Upload Weekly Lights PDFs
          </CardTitle>
          <CardDescription>
            Upload PDF files with weekly reports. File names should include the time period (e.g., "[COMPANY LIGHTS] June 14, 2025 - June 20, 2025")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              Drop PDF files here or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Support for multiple PDF files up to 10MB each
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {file.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : file.status === 'processing' ? (
                        <div className="h-5 w-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {file.timePeriod}
                        </span>
                        <span className="text-sm text-slate-500">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-sm text-slate-500">
                          Uploaded: {file.uploadDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 text-slate-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {uploadedFiles.some(f => f.status === 'processing') && (
        <Card className="glass-card border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-indigo-700">
              <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span className="font-medium">Processing uploaded PDFs...</span>
            </div>
            <p className="text-sm text-indigo-600 mt-2">
              Extracting data from PDFs and updating dashboard metrics
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
