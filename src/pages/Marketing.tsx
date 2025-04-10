import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { 
  BarChart, 
  Calendar, 
  FileEdit, 
  FilterX, 
  Mail, 
  MailPlus, 
  MoreHorizontal, 
  PenSquare, 
  Search, 
  Settings, 
  Tag, 
  Trash, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: number;
  name: string;
  status: "draft" | "active" | "completed" | "scheduled";
  type: "email" | "social" | "sms" | "push";
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  date: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  lastModified: string;
}

interface Audience {
  id: number;
  name: string;
  count: number;
  description: string;
  created: string;
}

const fetchCampaigns = async (): Promise<Campaign[]> => {
  return [
    {
      id: 1,
      name: "Summer Sale Promotion",
      status: "active",
      type: "email",
      audience: "Loyal Customers",
      sent: 1250,
      opened: 875,
      clicked: 320,
      date: "2025-04-05T15:30:00Z"
    },
    {
      id: 2,
      name: "New Product Launch",
      status: "scheduled",
      type: "email",
      audience: "All Subscribers",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "2025-04-15T10:00:00Z"
    },
    {
      id: 3,
      name: "Customer Feedback Survey",
      status: "draft",
      type: "email",
      audience: "Recent Buyers",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "2025-04-20T09:00:00Z"
    },
    {
      id: 4,
      name: "Inventory Clearance",
      status: "completed",
      type: "sms",
      audience: "All Customers",
      sent: 950,
      opened: 740,
      clicked: 210,
      date: "2025-04-01T13:00:00Z"
    },
    {
      id: 5,
      name: "Holiday Special Offer",
      status: "draft",
      type: "social",
      audience: "Social Followers",
      sent: 0,
      opened: 0,
      clicked: 0,
      date: "2025-05-12T11:30:00Z"
    }
  ];
};

const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  return [
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to our store!",
      category: "Onboarding",
      lastModified: "2025-04-02T14:30:00Z"
    },
    {
      id: 2,
      name: "Order Confirmation",
      subject: "Your order has been confirmed",
      category: "Transactional",
      lastModified: "2025-03-28T10:15:00Z"
    },
    {
      id: 3,
      name: "Abandoned Cart",
      subject: "Did you forget something?",
      category: "Recovery",
      lastModified: "2025-04-05T09:45:00Z"
    },
    {
      id: 4,
      name: "Seasonal Sale",
      subject: "Big savings inside!",
      category: "Promotional",
      lastModified: "2025-04-01T16:20:00Z"
    },
    {
      id: 5,
      name: "Product Recommendations",
      subject: "Products we think you'll love",
      category: "Promotional",
      lastModified: "2025-03-30T11:10:00Z"
    }
  ];
};

const fetchAudiences = async (): Promise<Audience[]> => {
  return [
    {
      id: 1,
      name: "All Subscribers",
      count: 4250,
      description: "All customers who have subscribed to our newsletter",
      created: "2024-12-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Loyal Customers",
      count: 856,
      description: "Customers who've made more than 3 purchases",
      created: "2025-01-20T14:45:00Z"
    },
    {
      id: 3,
      name: "Recent Buyers",
      count: 1342,
      description: "Customers who purchased in the last 30 days",
      created: "2025-03-10T09:15:00Z"
    },
    {
      id: 4,
      name: "Inactive Customers",
      count: 2150,
      description: "Customers with no activity in 90+ days",
      created: "2025-02-05T11:20:00Z"
    },
    {
      id: 5,
      name: "High-Value Customers",
      count: 342,
      description: "Customers with an average order value > $100",
      created: "2025-03-01T16:10:00Z"
    }
  ];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

const StatusBadge = ({ status }: { status: Campaign["status"] }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "scheduled":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor()} capitalize`}>
      {status}
    </Badge>
  );
};

const TypeBadge = ({ type }: { type: Campaign["type"] }) => {
  const getTypeIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="h-3 w-3 mr-1" />;
      case "social":
        return <Users className="h-3 w-3 mr-1" />;
      case "sms":
        return <Tag className="h-3 w-3 mr-1" />;
      case "push":
        return <BarChart className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 flex items-center">
      {getTypeIcon()}
      <span className="capitalize">{type}</span>
    </Badge>
  );
};

export default function Marketing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const { toast } = useToast();
  
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
  });
  
  const { data: templates = [], isLoading: templatesLoading } = useQuery<EmailTemplate[]>({
    queryKey: ["email-templates"],
    queryFn: fetchEmailTemplates,
  });
  
  const { data: audiences = [], isLoading: audiencesLoading } = useQuery<Audience[]>({
    queryKey: ["audiences"],
    queryFn: fetchAudiences,
  });
  
  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAudiences = audiences.filter(audience =>
    audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audience.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateCampaign = () => {
    toast({
      title: "Creating new campaign",
      description: "This feature would open a campaign creation wizard.",
    });
  };
  
  const handleCreateTemplate = () => {
    toast({
      title: "Creating new email template",
      description: "This feature would open the email template editor.",
    });
  };
  
  const handleCreateAudience = () => {
    toast({
      title: "Creating new audience segment",
      description: "This feature would open the audience segment builder.",
    });
  };
  
  const handleEdit = (id: number, type: string) => {
    toast({
      title: `Editing ${type} #${id}`,
      description: `This would open the ${type} editor.`,
    });
  };
  
  const handleDelete = (id: number, type: string) => {
    toast({
      title: `Delete ${type}?`,
      description: `This would prompt for confirmation before deleting ${type} #${id}.`,
      variant: "destructive",
    });
  };

  return (
    <MainLayout title="Marketing">
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
            <p className="text-muted-foreground">
              Manage campaigns, email templates, and audience segments
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedTab === "campaigns" && (
              <Button onClick={handleCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
                <PenSquare className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            )}
            {selectedTab === "templates" && (
              <Button onClick={handleCreateTemplate} className="bg-purple-600 hover:bg-purple-700">
                <FileEdit className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            )}
            {selectedTab === "audiences" && (
              <Button onClick={handleCreateAudience} className="bg-purple-600 hover:bg-purple-700">
                <Users className="mr-2 h-4 w-4" />
                Create Audience
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setSearchQuery("")}>
            <FilterX className="h-4 w-4" />
            Clear
          </Button>
        </div>
        
        <Tabs defaultValue="campaigns" className="space-y-6" onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="campaigns" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1">
              <FileEdit className="h-4 w-4" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="audiences" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Audiences
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead className="text-right">Sent</TableHead>
                      <TableHead className="text-right">Opened</TableHead>
                      <TableHead className="text-right">Clicked</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignsLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          Loading campaigns...
                        </TableCell>
                      </TableRow>
                    ) : filteredCampaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          No campaigns found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <StatusBadge status={campaign.status} />
                          </TableCell>
                          <TableCell>
                            <TypeBadge type={campaign.type} />
                          </TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{campaign.opened.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{campaign.clicked.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(campaign.date)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(campaign.id, "campaign")}>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(campaign.id, "campaign")}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templatesLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading templates...
                        </TableCell>
                      </TableRow>
                    ) : filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No templates found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.subject}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {template.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(template.lastModified)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(template.id, "template")}>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(template.id, "template")}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audiences" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audiencesLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading audiences...
                        </TableCell>
                      </TableRow>
                    ) : filteredAudiences.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No audiences found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAudiences.map((audience) => (
                        <TableRow key={audience.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{audience.name}</TableCell>
                          <TableCell>{audience.description}</TableCell>
                          <TableCell className="text-right">{audience.count.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(audience.created)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(audience.id, "audience")}>
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(audience.id, "audience")}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Email Performance</CardTitle>
                  <CardDescription>Overall campaign performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Open Rate</span>
                      <span className="text-sm font-bold">42.5%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "42.5%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Click Rate</span>
                      <span className="text-sm font-bold">18.3%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "18.3%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm font-bold">5.7%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "5.7%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Audience Growth</CardTitle>
                  <CardDescription>Subscriber trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Subscribers</span>
                      <span className="font-bold">8,542</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New This Month</span>
                      <span className="font-bold text-green-600">+248</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unsubscribed</span>
                      <span className="font-bold text-red-600">-32</span>
                    </div>
                    <div className="h-32 bg-gray-50 rounded-md flex items-end justify-between p-2 mt-2">
                      <div className="w-8 bg-purple-200 rounded-t h-40%"></div>
                      <div className="w-8 bg-purple-300 rounded-t h-50%"></div>
                      <div className="w-8 bg-purple-400 rounded-t h-60%"></div>
                      <div className="w-8 bg-purple-500 rounded-t h-45%"></div>
                      <div className="w-8 bg-purple-600 rounded-t h-70%"></div>
                      <div className="w-8 bg-purple-700 rounded-t h-80%"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Content</CardTitle>
                  <CardDescription>Most engaging email content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="text-sm font-medium">Summer Sale Promotion</p>
                        <p className="text-xs text-muted-foreground">24.5% CTR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="text-sm font-medium">New Product Launch</p>
                        <p className="text-xs text-muted-foreground">18.7% CTR</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="text-sm font-medium">Customer Feedback Survey</p>
                        <p className="text-xs text-muted-foreground">12.3% CTR</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      <BarChart className="h-4 w-4 mr-2" />
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
