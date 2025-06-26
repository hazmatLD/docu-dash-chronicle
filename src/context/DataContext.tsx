
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PdfData {
  id: string;
  fileName: string;
  timePeriod: string;
  uploadDate: string;
  metrics: {
    totalItemsDonated?: number;
    estimatedFMV?: number;
    totalRevenue?: number;
    quarterlyProgress?: number;
    activeRetailers?: number;
    nonprofitReach?: number;
  };
  departmentData: {
    operations?: {
      highlights: string[];
      lowlights: string[];
      okrs: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
      }>;
    };
    businessDev?: {
      highlights: string[];
      lowlights: string[];
      okrs: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
      }>;
    };
    marketing?: {
      highlights: string[];
      lowlights: string[];
      okrs: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
      }>;
    };
    product?: {
      highlights: string[];
      lowlights: string[];
      okrs: Array<{
        title: string;
        target: number;
        current: number;
        unit: string;
      }>;
    };
  };
}

interface DataContextType {
  pdfData: PdfData[];
  addPdfData: (data: PdfData) => void;
  removePdfData: (id: string) => void;
  getAggregatedMetrics: () => any;
  getDepartmentData: (department: string) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfData, setPdfData] = useState<PdfData[]>([]);

  const addPdfData = (data: PdfData) => {
    setPdfData(prev => [...prev, data]);
  };

  const removePdfData = (id: string) => {
    setPdfData(prev => prev.filter(item => item.id !== id));
  };

  const getAggregatedMetrics = () => {
    if (pdfData.length === 0) {
      return {
        totalItemsDonated: { value: '125,430', change: 12.5, trend: 'up' as const },
        estimatedFMV: { value: '$2.4M', change: 8.3, trend: 'up' as const },
        totalRevenue: { value: '$340K', change: -15.2, trend: 'down' as const },
        quarterlyProgress: { value: '67%', change: 5.8, trend: 'up' as const },
        activeRetailers: { value: '23', change: 2, trend: 'up' as const },
        nonprofitReach: { value: '89%', change: -3.1, trend: 'down' as const }
      };
    }

    // Aggregate data from all uploaded PDFs
    const aggregated = pdfData.reduce((acc, pdf) => {
      const metrics = pdf.metrics;
      if (metrics.totalItemsDonated) acc.totalItemsDonated += metrics.totalItemsDonated;
      if (metrics.estimatedFMV) acc.estimatedFMV += metrics.estimatedFMV;
      if (metrics.totalRevenue) acc.totalRevenue += metrics.totalRevenue;
      return acc;
    }, {
      totalItemsDonated: 0,
      estimatedFMV: 0,
      totalRevenue: 0,
      quarterlyProgress: 67,
      activeRetailers: 23,
      nonprofitReach: 89
    });

    return {
      totalItemsDonated: { value: aggregated.totalItemsDonated.toLocaleString(), change: 12.5, trend: 'up' as const },
      estimatedFMV: { value: `$${(aggregated.estimatedFMV / 1000000).toFixed(1)}M`, change: 8.3, trend: 'up' as const },
      totalRevenue: { value: `$${(aggregated.totalRevenue / 1000).toFixed(0)}K`, change: -15.2, trend: 'down' as const },
      quarterlyProgress: { value: `${aggregated.quarterlyProgress}%`, change: 5.8, trend: 'up' as const },
      activeRetailers: { value: aggregated.activeRetailers.toString(), change: 2, trend: 'up' as const },
      nonprofitReach: { value: `${aggregated.nonprofitReach}%`, change: -3.1, trend: 'down' as const }
    };
  };

  const getDepartmentData = (department: string) => {
    const departmentKey = department.toLowerCase().replace(' ', '');
    const relevantData = pdfData.filter(pdf => pdf.departmentData[departmentKey as keyof typeof pdf.departmentData]);
    
    if (relevantData.length === 0) {
      return null;
    }

    return relevantData.map(pdf => ({
      week: pdf.timePeriod,
      date: pdf.uploadDate,
      highlights: pdf.departmentData[departmentKey as keyof typeof pdf.departmentData]?.highlights || [],
      lowlights: pdf.departmentData[departmentKey as keyof typeof pdf.departmentData]?.lowlights || [],
      okrs: pdf.departmentData[departmentKey as keyof typeof pdf.departmentData]?.okrs || []
    }));
  };

  return (
    <DataContext.Provider value={{
      pdfData,
      addPdfData,
      removePdfData,
      getAggregatedMetrics,
      getDepartmentData
    }}>
      {children}
    </DataContext.Provider>
  );
};
