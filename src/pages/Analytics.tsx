
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, BarChart, PieChart, TrendingUp, Users, ShoppingCart, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Sample data for charts
const monthlyRevenueData = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 210 },
  { name: "Mar", revenue: 5000, orders: 280 },
  { name: "Apr", revenue: 2780, orders: 190 },
  { name: "May", revenue: 1890, orders: 170 },
  { name: "Jun", revenue: 2390, orders: 250 },
  { name: "Jul", revenue: 3490, orders: 310 },
];

const salesByProductData = [
  { name: "Espresso", value: 400 },
  { name: "Cappuccino", value: 300 },
  { name: "Latte", value: 300 },
  { name: "Cold Brew", value: 200 },
  { name: "Americano", value: 100 },
];

const salesByHourData = [
  { hour: "7AM", sales: 240 },
  { hour: "8AM", sales: 450 },
  { hour: "9AM", sales: 380 },
  { hour: "10AM", sales: 290 },
  { hour: "11AM", sales: 330 },
  { hour: "12PM", sales: 500 },
  { hour: "1PM", sales: 480 },
  { hour: "2PM", sales: 400 },
  { hour: "3PM", sales: 340 },
  { hour: "4PM", sales: 280 },
  { hour: "5PM", sales: 310 },
  { hour: "6PM", sales: 370 },
  { hour: "7PM", sales: 280 },
  { hour: "8PM", sales: 160 },
];

const customerData = [
  { name: "New", value: 540 },
  { name: "Returning", value: 1460 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Analytics = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [timeframe, setTimeframe] = useState("30days");

  return (
    <MainLayout title="Analytics & Report">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs defaultValue="overview" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[250px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange as any}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <CreditCard className="inline-block mr-2 h-4 w-4" /> Total Revenue
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">+12.5%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,780</div>
            <p className="text-xs text-muted-foreground">+$3,120 from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <ShoppingCart className="inline-block mr-2 h-4 w-4" /> Total Orders
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">+9.2%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,653</div>
            <p className="text-xs text-muted-foreground">+144 from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Users className="inline-block mr-2 h-4 w-4" /> Customer Growth
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">+5.7%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+538</div>
            <p className="text-xs text-muted-foreground">+29 from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <TrendingUp className="inline-block mr-2 h-4 w-4" /> Conversion Rate
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">+2.1%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last period</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue & Orders</CardTitle>
                <CardDescription>Monthly revenue and order trends</CardDescription>
              </div>
              <Select defaultValue="revenue">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="combined">Combined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Product</CardTitle>
            <CardDescription>Top selling products breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={salesByProductData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByProductData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales by Hour</CardTitle>
            <CardDescription>Hourly sales distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={salesByHourData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Customer Types</CardTitle>
            <CardDescription>New vs. returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Customers with highest purchase value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, name: "John Smith", orders: 24, spent: 1245.80 },
                { id: 2, name: "Sarah Johnson", orders: 18, spent: 980.50 },
                { id: 3, name: "Michael Brown", orders: 15, spent: 875.25 },
                { id: 4, name: "Emma Wilson", orders: 12, spent: 760.40 },
                { id: 5, name: "David Lee", orders: 10, spent: 645.90 },
              ].map((customer, index) => (
                <div key={customer.id} className="flex items-center">
                  <div className="mr-4 rounded-full bg-muted p-2">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.orders} orders</div>
                  </div>
                  <div className="text-right font-medium">${customer.spent.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Missing Badge component declaration
const Badge = ({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) => {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "outline" ? "border" : "bg-primary text-primary-foreground",
      className
    )}>
      {children}
    </span>
  );
};

export default Analytics;
