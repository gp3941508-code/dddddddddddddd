import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sidebar, Header } from '@/components/google-ads';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  RotateCcw, 
  Calendar as CalendarIcon,
  X,
  Plus,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAds } from '@/hooks/useAds';

const AdminCreateAd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createAd } = useAds();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetUrl: '',
    budget: '',
    status: 'active',
    startDate: null as Date | null,
    endDate: null as Date | null,
    assignedUser: '',
    targetAudience: [] as string[],
    adImage: null as File | null
  });

  const [audienceInput, setAudienceInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, adImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAudienceTag = () => {
    if (audienceInput.trim() && !formData.targetAudience.includes(audienceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, audienceInput.trim()]
      }));
      setAudienceInput('');
    }
  };

  const removeAudienceTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.targetUrl || !formData.budget) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get assigned user name
      const assignedUser = formData.assignedUser 
        ? users.find(u => u.id === formData.assignedUser)
        : null;

      // Create ad data matching database schema
      const adData = {
        name: formData.name,
        status: formData.status as 'active' | 'paused' | 'ended',
        budget_amount: parseFloat(formData.budget),
        budget_period: 'day',
        impressions: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0,
        conversions: 0,
        cost_per_conversion: 0,
        assigned_user_id: formData.assignedUser || null,
        assigned_user_name: assignedUser?.name || null
      };

      console.log('Creating ad:', adData);
      
      await createAd(adData);
      
      toast({
        title: "Success!",
        description: "Ad created successfully",
      });
      
      navigate('/admin/ads');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ad. Please try again.",
        variant: "destructive"
      });
      console.error('Error creating ad:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      targetUrl: '',
      budget: '',
      status: 'active',
      startDate: null,
      endDate: null,
      assignedUser: '',
      targetAudience: [],
      adImage: null
    });
    setImagePreview(null);
    setAudienceInput('');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/admin/ads')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Ad</h1>
              <p className="text-muted-foreground">Set up a new advertising campaign</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Ad Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter ad name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your ad campaign"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="targetUrl">Target URL *</Label>
                      <Input
                        id="targetUrl"
                        type="url"
                        value={formData.targetUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Ad Creative */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ad Creative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label>Ad Image</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="max-w-full h-48 object-cover rounded" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData(prev => ({ ...prev, adImage: null }));
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                  Click to upload or drag and drop
                                </span>
                                <span className="mt-1 block text-sm text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </span>
                              </label>
                              <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">Daily Budget (₹) *</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="500"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch
                            checked={formData.status === 'active'}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, status: checked ? 'active' : 'paused' }))
                            }
                          />
                          <Label>{formData.status === 'active' ? 'Active' : 'Paused'}</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.startDate || undefined}
                              onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date || null }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.endDate || undefined}
                              onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date || null }))}
                              initialFocus
                              disabled={(date) => formData.startDate ? date < formData.startDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Targeting */}
                <Card>
                  <CardHeader>
                    <CardTitle>Targeting & Assignment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Assign to User</Label>
                      <Select value={formData.assignedUser} onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, assignedUser: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Target Audience</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={audienceInput}
                          onChange={(e) => setAudienceInput(e.target.value)}
                          placeholder="Add audience segment"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addAudienceTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addAudienceTag}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.targetAudience.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="px-2 py-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeAudienceTag(tag)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Ad preview" className="w-full h-32 object-cover rounded mb-3" />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                          <span className="text-gray-400">No image uploaded</span>
                        </div>
                      )}
                      <h3 className="font-medium">{formData.name || 'Ad Name'}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.description || 'Ad description will appear here'}
                      </p>
                      <div className="mt-3 text-xs text-blue-600">
                        {formData.targetUrl || 'https://example.com'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>₹{formData.budget || '0'}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                        {formData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>
                        {formData.startDate && formData.endDate 
                          ? `${format(formData.startDate, 'MMM dd')} - ${format(formData.endDate, 'MMM dd')}`
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span>
                        {formData.assignedUser 
                          ? users.find(u => u.id === formData.assignedUser)?.name
                          : 'Unassigned'
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Form Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateAd;