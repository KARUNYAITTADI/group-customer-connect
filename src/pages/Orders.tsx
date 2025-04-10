
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, RefreshCcw, Eye, Download, MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample orders data
const mockOrders = [
  { id: "ORD-001", customer: "John Smith", date: "2025-04-09", total: 78.50, status: "completed", items: 3 },
  { id: "ORD-002", customer: "Sarah Johnson", date: "2025-04-09", total: 125.75, status: "processing", items: 5 },
  { id: "ORD-003", customer: "Michael Brown", date: "2025-04-08", total: 42.99, status: "completed", items: 2 },
  { id: "ORD-004", customer: "Emma Wilson", date: "2025-04-08", total: 89.25, status: "completed", items: 4 },
  { id: "ORD-005", customer: "David Lee", date: "2025-04-07", total: 156.80, status: "cancelled", items: 6 },
  { id: "ORD-006", customer: "Amanda Clark", date: "2025-04-07", total: 67.30, status: "processing", items: 3 },
  { id: "ORD-007", customer: "Robert Garcia", date: "2025-04-06", total: 45.95, status: "completed", items: 2 },
  { id: "ORD-008", customer: "Jennifer Lopez", date: "2025-04-06", total: 112.45, status: "completed", items: 4 },
  { id: "ORD-009", customer: "William Taylor", date: "2025-04-05", total: 95.20, status: "processing", items: 5 },
  { id: "ORD-010", customer: "Elizabeth Martin", date: "2025-04-05", total: 78.60, status: "completed", items: 3 },
  { id: "ORD-011", customer: "James Anderson", date: "2025-04-04", total: 134.90, status: "cancelled", items: 6 },
  { id: "ORD-012", customer: "Patricia Thomas", date: "2025-04-04", total: 56.75, status: "completed", items: 2 },
];

// Order status color map
const statusColorMap: Record<string, string> = {
  processing: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

// Define the Order type
interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [orderBy, setOrderBy] = useState("date");
  const [orderDirection, setOrderDirection] = useState("desc");

  // Simulating data fetching with React Query
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => {
      // In a real app, this would be an API call
      return new Promise<Order[]>((resolve) => {
        setTimeout(() => resolve(mockOrders), 500);
      });
    },
  });

  // Filter and sort orders
  const filteredOrders = orders
    ? orders.filter((order) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (orderBy === "date") {
      return orderDirection === "asc" 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (orderBy === "total") {
      return orderDirection === "asc" ? a.total - b.total : b.total - a.total;
    }
    return 0;
  });

  // Pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("desc");
    }
  };

  return (
    <MainLayout title="Orders">
      <div className="mb-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Orders</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search order ID or customer..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading orders...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error loading orders. Please try again.</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => toggleSort("date")}
                      >
                        Date 
                        {orderBy === "date" && (
                          <span className="ml-1">{orderDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead 
                        className="text-right cursor-pointer"
                        onClick={() => toggleSort("total")}
                      >
                        Total 
                        {orderBy === "total" && (
                          <span className="ml-1">{orderDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">{order.items}</TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`${statusColorMap[order.status]} text-white`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Orders;
