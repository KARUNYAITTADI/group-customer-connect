
import React from "react";
import { Bar, Line } from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Sample data for charts
const salesData = [
  { name: "Jan", total: 1200, orders: 90, profit: 800 },
  { name: "Feb", total: 1900, orders: 120, profit: 1100 },
  { name: "Mar", total: 1500, orders: 100, profit: 950 },
  { name: "Apr", total: 1800, orders: 115, profit: 1250 },
  { name: "May", total: 2200, orders: 145, profit: 1500 },
  { name: "Jun", total: 2400, orders: 160, profit: 1650 },
  { name: "Jul", total: 2100, orders: 140, profit: 1300 },
  { name: "Aug", total: 2600, orders: 170, profit: 1800 },
  { name: "Sep", total: 2300, orders: 150, profit: 1550 },
  { name: "Oct", total: 2900, orders: 185, profit: 2000 },
  { name: "Nov", total: 3100, orders: 195, profit: 2200 },
  { name: "Dec", total: 3500, orders: 220, profit: 2500 },
];

const productData = [
  { name: "Product A", sales: 4000, stock: 2400 },
  { name: "Product B", sales: 3000, stock: 1398 },
  { name: "Product C", sales: 2000, stock: 9800 },
  { name: "Product D", sales: 2780, stock: 3908 },
  { name: "Product E", sales: 1890, stock: 4800 },
];

const Dashboard = () => {
  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+12.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+255</div>
            <p className="text-xs text-muted-foreground">+8.4% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.42</div>
            <p className="text-xs text-muted-foreground">+6.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales and orders performance</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="orders" barSize={30} fill="#413ea0" />
                <Line type="monotone" dataKey="profit" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="overview">
              <div className="flex items-center justify-between">
                <CardTitle>Product Analytics</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                  <Bar dataKey="stock" fill="#82ca9d" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with highest sales this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-4 rounded-full bg-muted p-2">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">${product.sales}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
