
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, ArrowUpDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Mock purchase orders data
const mockPurchaseOrders: PurchaseOrder[] = [
  { 
    id: "PO-2024-001", 
    supplier: "Bean Masters Co.", 
    date: "2024-04-05", 
    deliveryDate: "2024-04-12", 
    total: 1250.75, 
    status: "Pending",
    items: [
      { id: 1, name: "Coffee Beans (Arabica)", quantity: 25, unit: "kg", unitPrice: 28.50 },
      { id: 2, name: "Coffee Beans (Robusta)", quantity: 20, unit: "kg", unitPrice: 22.75 }
    ]
  },
  { 
    id: "PO-2024-002", 
    supplier: "Dairy Express", 
    date: "2024-04-06", 
    deliveryDate: "2024-04-10", 
    total: 375.20, 
    status: "Received",
    items: [
      { id: 1, name: "Milk", quantity: 50, unit: "L", unitPrice: 3.75 },
      { id: 2, name: "Cream", quantity: 20, unit: "L", unitPrice: 8.50 }
    ]
  },
  { 
    id: "PO-2024-003", 
    supplier: "Sweet Supplies Inc.", 
    date: "2024-04-07", 
    deliveryDate: "2024-04-14", 
    total: 680.00, 
    status: "Pending",
    items: [
      { id: 1, name: "Sugar", quantity: 40, unit: "kg", unitPrice: 12.00 },
      { id: 2, name: "Chocolate Syrup", quantity: 10, unit: "bottles", unitPrice: 28.00 }
    ]
  },
  { 
    id: "PO-2024-004", 
    supplier: "Cup & Pack Solutions", 
    date: "2024-04-03", 
    deliveryDate: "2024-04-15", 
    total: 895.50, 
    status: "Approved",
    items: [
      { id: 1, name: "Paper Cups (12oz)", quantity: 1500, unit: "pieces", unitPrice: 0.35 },
      { id: 2, name: "Paper Cups (16oz)", quantity: 1000, unit: "pieces", unitPrice: 0.45 }
    ]
  },
  { 
    id: "PO-2024-005", 
    supplier: "Flavor Kingdom", 
    date: "2024-04-08", 
    deliveryDate: "2024-04-18", 
    total: 547.25, 
    status: "Pending",
    items: [
      { id: 1, name: "Vanilla Syrup", quantity: 15, unit: "bottles", unitPrice: 15.50 },
      { id: 2, name: "Caramel Syrup", quantity: 15, unit: "bottles", unitPrice: 15.75 },
      { id: 3, name: "Hazelnut Syrup", quantity: 10, unit: "bottles", unitPrice: 16.25 }
    ]
  },
  { 
    id: "PO-2024-006", 
    supplier: "Bean Masters Co.", 
    date: "2024-03-25", 
    deliveryDate: "2024-04-02", 
    total: 1450.00, 
    status: "Received",
    items: [
      { id: 1, name: "Coffee Beans (Arabica)", quantity: 30, unit: "kg", unitPrice: 28.50 },
      { id: 2, name: "Coffee Beans (Robusta)", quantity: 25, unit: "kg", unitPrice: 22.75 }
    ]
  },
];

// Define the interfaces
interface PurchaseOrderItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  date: string;
  deliveryDate: string;
  total: number;
  status: "Pending" | "Approved" | "Received" | "Cancelled";
  items: PurchaseOrderItem[];
}

// Status color mapping
const statusColors: Record<string, string> = {
  Pending: "bg-amber-400 hover:bg-amber-600",
  Approved: "bg-blue-500 hover:bg-blue-600",
  Received: "bg-green-500 hover:bg-green-600",
  Cancelled: "bg-red-500 hover:bg-red-600",
};

const PurchaseOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 5;

  // Fetch purchase orders data
  const { data: purchaseOrders, isLoading, isError } = useQuery<PurchaseOrder[]>({
    queryKey: ["purchaseOrders"],
    queryFn: () => {
      // In a real app, this would be an API call
      return new Promise<PurchaseOrder[]>((resolve) => {
        setTimeout(() => resolve(mockPurchaseOrders), 500);
      });
    },
  });

  // Sort and filter purchase orders
  const filteredPurchaseOrders = purchaseOrders
    ? purchaseOrders
        .filter((order) => {
          const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = 
            statusFilter === "all" || 
            order.status.toLowerCase() === statusFilter.toLowerCase();
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          if (sortBy === "date") {
            return sortOrder === "asc" 
              ? new Date(a.date).getTime() - new Date(b.date).getTime() 
              : new Date(b.date).getTime() - new Date(a.date).getTime();
          } else if (sortBy === "total") {
            return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
          } else if (sortBy === "supplier") {
            return sortOrder === "asc" 
              ? a.supplier.localeCompare(b.supplier) 
              : b.supplier.localeCompare(a.supplier);
          }
          return 0;
        })
    : [];

  // Pagination
  const totalPages = Math.ceil((filteredPurchaseOrders?.length || 0) / itemsPerPage);
  const currentItems = filteredPurchaseOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Count purchase orders by status
  const pendingCount = purchaseOrders?.filter(po => po.status === "Pending").length || 0;
  const approvedCount = purchaseOrders?.filter(po => po.status === "Approved").length || 0;
  const receivedCount = purchaseOrders?.filter(po => po.status === "Received").length || 0;

  return (
    <MainLayout title="Purchase Orders">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total POs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{receivedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Purchase Orders</CardTitle>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by PO# or supplier..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"} 
                  size="sm"
                  className={statusFilter === "pending" ? "bg-amber-400 hover:bg-amber-500" : ""}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button 
                  variant={statusFilter === "approved" ? "default" : "outline"} 
                  size="sm"
                  className={statusFilter === "approved" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved
                </Button>
                <Button 
                  variant={statusFilter === "received" ? "default" : "outline"}
                  size="sm" 
                  className={statusFilter === "received" ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={() => setStatusFilter("received")}
                >
                  Received
                </Button>
                <Button 
                  variant={statusFilter === "cancelled" ? "default" : "outline"} 
                  size="sm"
                  className={statusFilter === "cancelled" ? "bg-red-500 hover:bg-red-600" : ""}
                  onClick={() => setStatusFilter("cancelled")}
                >
                  Cancelled
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : isError ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading purchase order data
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO#</TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort("supplier")}
                          >
                            <div className="flex items-center">
                              Supplier
                              {sortBy === "supplier" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort("date")}
                          >
                            <div className="flex items-center">
                              Order Date
                              {sortBy === "date" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Delivery Date</TableHead>
                          <TableHead 
                            className="text-right cursor-pointer"
                            onClick={() => handleSort("total")}
                          >
                            <div className="flex items-center justify-end">
                              Total
                              {sortBy === "total" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              No purchase orders found
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentItems.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.supplier}</TableCell>
                              <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                              <TableCell>{format(new Date(order.deliveryDate), "MMM dd, yyyy")}</TableCell>
                              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={statusColors[order.status]}
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PurchaseOrder;
