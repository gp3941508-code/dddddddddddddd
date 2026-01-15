import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, Header } from '@/components/google-ads';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Expand,
  Calendar,
  Plus
} from 'lucide-react';
import { useAds } from '@/hooks/useAds';

const Content = () => {
  const { ads, loading } = useAds();
  const [showExclusionsTable, setShowExclusionsTable] = useState(true);

  // Generate sample content exclusions based on existing ads
  const contentExclusions = ads.flatMap(ad => [
    {
      id: `${ad.id}-1`,
      content: `${ad.name.toLowerCase().replace(/\s+/g, '-')}-content`,
      type: 'Placement',
      excludedFrom: ad.name,
      level: 'Campaign',
      adId: ad.id
    },
    {
      id: `${ad.id}-2`, 
      content: `inappropriate-${ad.name.toLowerCase()}`,
      type: 'Keyword',
      excludedFrom: ad.name,
      level: 'Ad group',
      adId: ad.id
    }
  ]);

  const activeExclusions = contentExclusions.slice(0, 5); // Show limited data

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-lg">Loading content...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Content</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">All time</span>
                <Select defaultValue="range">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Oct 30, 2024 - Jul 26, 2025" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="range">Oct 30, 2024 - Jul 26, 2025</SelectItem>
                    <SelectItem value="last30">Last 30 days</SelectItem>
                    <SelectItem value="last7">Last 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link" className="text-google-blue text-sm">
                Show last 30 days
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View (2 filters)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All campaigns</SelectItem>
                  <SelectItem value="active">Active campaigns</SelectItem>
                  <SelectItem value="paused">Paused campaigns</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="campaigns">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Campaigns (1)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaigns">Select a campaign</SelectItem>
                  {ads.map(ad => (
                    <SelectItem key={ad.id} value={ad.id}>{ad.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Detail */}
          <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
            <span className="font-medium">Filters:</span>
            <div className="flex gap-4">
              <span>Campaign status: All</span>
              <span>Ad group status: Enabled, Paused</span>
              <Button variant="link" className="text-google-blue p-0 h-auto text-sm">
                Add filter
              </Button>
            </div>
          </div>

          {/* Exclusions Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExclusionsTable(!showExclusionsTable)}
                    className="p-1"
                  >
                    {showExclusionsTable ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </Button>
                  <CardTitle className="text-lg">Exclusions</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="link" className="text-google-blue text-sm">
                    Edit exclusions
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Expand className="h-4 w-4" />
                    <span className="ml-1 text-sm">Expand</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="ml-1 text-sm">More</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            {showExclusionsTable && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-google-blue-light text-google-blue">
                    <Filter className="w-3 h-3 mr-1" />
                    Type: Placement, Keyword, ... (and 1 more)
                  </Badge>
                  <Button variant="link" className="text-google-blue p-0 h-auto text-sm">
                    Add filter
                  </Button>
                </div>

                {activeExclusions.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead className="font-semibold">
                            Content
                            <Button variant="ghost" size="sm" className="ml-1 p-0 h-auto">
                              ↕
                            </Button>
                          </TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Excluded from</TableHead>
                          <TableHead className="font-semibold">Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeExclusions.map((exclusion) => (
                          <TableRow key={exclusion.id} className="hover:bg-muted/30">
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                              {exclusion.content}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{exclusion.type}</Badge>
                            </TableCell>
                            <TableCell className="text-google-blue">
                              {exclusion.excludedFrom}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{exclusion.level}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nothing matches your filters</p>
                  </div>
                )}

                {activeExclusions.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="link" className="text-google-blue text-sm">
                      Hide table
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Showing {activeExclusions.length} of {contentExclusions.length} exclusions
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Keywords Section */}
          <Card className="mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Keywords</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add keywords
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No keywords to display</p>
                <Button variant="link" className="text-google-blue mt-2">
                  Add your first keyword
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audiences Section */}
          <Card className="mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Audiences</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add audiences
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No audiences to display</p>
                <Button variant="link" className="text-google-blue mt-2">
                  Add your first audience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Content;