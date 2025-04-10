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
        </Tabs>
      </div>
    </MainLayout>
  );
}
