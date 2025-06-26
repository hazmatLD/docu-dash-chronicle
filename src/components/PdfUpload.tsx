import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Calendar, CheckCircle } from 'lucide-react';
import { useData, PdfData } from '../context/DataContext';
import localforage from 'localforage';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

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
  const { addPdfData } = useData();

  const extractTimePeriod = (filename: string): string => {
    const datePattern = /(\w+\s+\d+,\s+\d+\s+-\s+\w+\s+\d+,\s+\d+)/;
    const match = filename.match(datePattern);
    return match ? match[1] : 'Unknown period';
  };

  const parsePdfData = (filename: string): PdfData => {
    const timePeriod = extractTimePeriod(filename);
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fileName: filename,
      timePeriod,
      uploadDate: new Date().toLocaleDateString(),
      metrics: {
        totalItemsDonated: Math.floor(Math.random() * 50000) + 100000,
        estimatedFMV: Math.floor(Math.random() * 1000000) + 2000000,
        totalRevenue: Math.floor(Math.random() * 100000) + 300000,
        quarterlyProgress: Math.floor(Math.random() * 30) + 60,
        activeRetailers: Math.floor(Math.random() * 10) + 20,
        nonprofitReach: Math.floor(Math.random() * 20) + 80
      },
      departmentData: {
        operations: {
          highlights: [
            'Automated 3 new donation processing workflows',
            'Reduced manual errors by 15%',
            'Improved system uptime to 99.9%'
          ],
          lowlights: [
            'System downtime affected 2 retailers',
            'Training delayed for new hires'
          ],
          okrs: [
            { title: 'Reduce processing time', target: 100, current: 85, unit: '% improvement' },
            { title: 'Increase automation coverage', target: 90, current: 72, unit: '% of processes' }
          ]
        },
        businessDev: {
          highlights: [
            'Signed 2 new major retailers',
            'Closed $50K enterprise deal',
            'Expanded into 3 new markets'
          ],
          lowlights: [
            'Lost 1 mid-tier client to competitor',
            'Delayed contract renewal with key partner'
          ],
          okrs: [
            { title: 'New retailer onboarding', target: 25, current: 18, unit: 'retailers' },
            { title: 'Revenue per retailer', target: 15000, current: 12800, unit: '$ monthly' }
          ]
        }
      }
    };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
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

        // Read PDF as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items
            .map(item => ('str' in item ? item.str : ''))
            .join(' ') + '\n';
        }

        // Parse stats, highlights, lowlights from text
        const stats = extractStats(fullText);
        const { highlights, lowlights } = extractHighlightsLowlights(fullText);
        const timePeriod = extractTimePeriod(file.name);

        // Store file in localforage for persistence
        await localforage.setItem(`pdf-file-${newFile.id}`, arrayBuffer);

        // Build parsedData
        const parsedData: PdfData = {
          id: newFile.id,
          fileName: file.name,
          timePeriod,
          uploadDate: newFile.uploadDate,
          metrics: stats,
          departmentData: {
            operations: {
              highlights: highlights.operations,
              lowlights: lowlights.operations,
              okrs: [] // TODO: Parse OKRs if present
            },
            businessDev: {
              highlights: highlights.businessDev,
              lowlights: lowlights.businessDev,
              okrs: [] // TODO: Parse OKRs if present
            }
          }
        };
        addPdfData(parsedData);
        setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'completed' } : f));
      }
    }
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
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
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
              <span className="font-medium">Processing uploaded PDFs and extracting data...</span>
            </div>
            <p className="text-sm text-indigo-600 mt-2">
              Extracting metrics and updating dashboard with real data from your weekly reports
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper: Extract stats from text
function extractStats(text: string) {
  // Example: Use regex to find numbers for stats
  // You should adapt these patterns to your PDF format
  const totalItemsDonated = parseInt((/Total Items Donated:\s*([\d,]+)/i.exec(text)?.[1] || '0').replace(/,/g, ''));
  const estimatedFMV = parseInt((/Estimated FMV:\s*\$?([\d,]+)/i.exec(text)?.[1] || '0').replace(/,/g, ''));
  const totalRevenue = parseInt((/Total Revenue:\s*\$?([\d,]+)/i.exec(text)?.[1] || '0').replace(/,/g, ''));
  const quarterlyProgress = parseInt((/Quarterly Progress:\s*(\d+)%/i.exec(text)?.[1] || '0'));
  const activeRetailers = parseInt((/Active Retailers:\s*(\d+)/i.exec(text)?.[1] || '0'));
  const nonprofitReach = parseInt((/Nonprofit Reach:\s*(\d+)%/i.exec(text)?.[1] || '0'));
  return {
    totalItemsDonated,
    estimatedFMV,
    totalRevenue,
    quarterlyProgress,
    activeRetailers,
    nonprofitReach
  };
}

// Helper: Extract highlights and lowlights
function extractHighlightsLowlights(text: string) {
  // Example: Use regex or section splitting
  // You should adapt these patterns to your PDF format
  const highlightsOps = extractSection(text, /Operations Highlights:(.*?)(?:Lowlights:|$)/is);
  const lowlightsOps = extractSection(text, /Operations Lowlights:(.*?)(?:Highlights:|$)/is);
  const highlightsBD = extractSection(text, /Business Development Highlights:(.*?)(?:Lowlights:|$)/is);
  const lowlightsBD = extractSection(text, /Business Development Lowlights:(.*?)(?:Highlights:|$)/is);
  return {
    highlights: {
      operations: highlightsOps,
      businessDev: highlightsBD
    },
    lowlights: {
      operations: lowlightsOps,
      businessDev: lowlightsBD
    }
  };
}

function extractSection(text: string, regex: RegExp) {
  const match = regex.exec(text);
  if (!match || !match[1]) return [];
  // Split by line or bullet
  return match[1].split(/\n|•|\*/).map(s => s.trim()).filter(Boolean);
}
