import { createContext, useContext, useState, ReactNode } from 'react';

type DateRangeType = 'today' | '7days' | '1month' | 'alltime';

interface DateRangeContextType {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  getDateRangeText: () => string;
  getStartDate: () => Date;
  getEndDate: () => Date;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error('useDateRange must be used within DateRangeProvider');
  }
  return context;
};

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRangeType>('today');

  const getStartDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateRange) {
      case 'today':
        return today;
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
      case '1month':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return oneMonthAgo;
      case 'alltime':
      default:
        return new Date('2024-10-30');
    }
  };

  const getEndDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    return yesterday;
  };

  const getDateRangeText = () => {
    if (dateRange === 'today') {
      return 'Today';
    }
    
    const start = getStartDate();
    const end = getEndDate();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <DateRangeContext.Provider value={{ 
      dateRange, 
      setDateRange, 
      getDateRangeText,
      getStartDate,
      getEndDate
    }}>
      {children}
    </DateRangeContext.Provider>
  );
};
