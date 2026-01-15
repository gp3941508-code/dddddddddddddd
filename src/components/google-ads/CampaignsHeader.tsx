import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDateRange } from '@/contexts/DateRangeContext';
import { cn } from '@/lib/utils';

const CampaignsHeader = () => {
  const { dateRange, setDateRange } = useDateRange();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const getDisplayText = () => {
    switch (dateRange) {
      case 'today':
        return 'Today';
      case '7days':
        return 'Last 7 days';
      case '1month':
        return 'Last 30 days';
      case 'alltime':
        return 'All time';
      default:
        return 'Today';
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="text-muted-foreground">Filters</span>
        <span className="text-muted-foreground">Campaign status: All</span>
        <span className="text-muted-foreground">Ad group status: Enabled, Paused</span>
        <Button variant="outline" size="sm" className="h-7 text-xs">Add filter</Button>
      </div>

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground cursor-pointer hover:text-foreground">Overview</span>
          <span className="text-muted-foreground cursor-pointer hover:text-foreground">Recommendations</span>
          <span className="text-muted-foreground cursor-pointer hover:text-foreground">Insights and reports</span>
        </div>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-8 px-4 justify-between text-sm font-normal min-w-[280px]"
              )}
            >
              <span>{getDisplayText()}</span>
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  setDateRange('today');
                  setIsCalendarOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-accent text-left"
              >
                Today
              </button>
              <button
                onClick={() => {
                  setDateRange('7days');
                  setIsCalendarOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-accent text-left"
              >
                Last 7 days
              </button>
              <button
                onClick={() => {
                  setDateRange('1month');
                  setIsCalendarOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-accent text-left"
              >
                Last 30 days
              </button>
              <button
                onClick={() => {
                  setDateRange('alltime');
                  setIsCalendarOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-accent text-left"
              >
                All time
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal">Campaigns</h1>
      </div>
    </>
  );
};

export default CampaignsHeader;