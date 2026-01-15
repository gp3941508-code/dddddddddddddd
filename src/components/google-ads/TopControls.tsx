import { Plus, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useDateRange } from '@/contexts/DateRangeContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

const TopControls = () => {
  const { dateRange, setDateRange, getDateRangeText } = useDateRange();
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
        return getDateRangeText();
    }
  };

  return (
    <>
      {/* View selector */}
      <div className="flex items-center gap-1 mb-4">
        <Select defaultValue="all-campaigns">
          <SelectTrigger className="w-48 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-campaigns">All campaigns</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="select-campaign">
          <SelectTrigger className="w-48 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="select-campaign">Select a campaign</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          <Button className="bg-[hsl(var(--google-blue))] hover:bg-[hsl(var(--google-blue))] text-white font-medium rounded-full px-6">
            Overview
          </Button>
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

      {/* Overview Title and New Campaign Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal">Overview</h1>
        <Button variant="outline" className="flex items-center gap-2 text-[hsl(var(--google-blue))] border-[hsl(var(--google-blue))] hover:bg-[hsl(var(--google-blue-light))]">
          <Plus className="w-4 h-4" />
          New campaign
        </Button>
      </div>
    </>
  );
};

export default TopControls;