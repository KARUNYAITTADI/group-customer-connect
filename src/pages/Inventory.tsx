
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock inventory data
const mockInventory: InventoryItem[] = [
  { id: 1, name: "Coffee Beans (Arabica)", sku: "CB-ARA-001", category: "Ingredients", quantity: 45, unit: "kg", reorderLevel: 10, status: "In Stock" },
  { id: 2, name: "Coffee Beans (Robusta)", sku: "CB-ROB-002", category: "Ingredients", quantity: 32, unit: "kg", reorderLevel: 10, status: "In Stock" },
  { id: 3, name: "Milk", sku: "MLK-001", category: "Ingredients", quantity: 18, unit: "L", reorderLevel: 20, status: "Low Stock" },
  { id: 4, name: "Sugar", sku: "SUG-001", category: "Ingredients", quantity: 50, unit: "kg", reorderLevel: 15, status: "In Stock" },
  { id: 5, name: "Chocolate Syrup", sku: "SYP-CHO-001", category: "Ingredients", quantity: 8, unit: "bottles", reorderLevel: 10, status: "Low Stock" },
  { id: 6, name: "Caramel Syrup", sku: "SYP-CAR-002", category: "Ingredients", quantity: 12, unit: "bottles", reorderLevel: 10, status: "In Stock" },
  { id: 7, name: "Vanilla Syrup", sku: "SYP-VAN-003", category: "Ingredients", quantity: 5, unit: "bottles", reorderLevel: 10, status: "Low Stock" },
  { id: 8, name: "Paper Cups (12oz)", sku: "CUP-12-001", category: "Packaging", quantity: 620, unit: "pieces", reorderLevel: 200, status: "In Stock" },
  { id: 9, name: "Paper Cups (16oz)", sku: "CUP-16-002", category: "Packaging", quantity: 148, unit: "pieces", reorderLevel: 200, status: "Low Stock" },
  { id: 10, name: "Lids", sku: "LID-001", category: "Packaging", quantity: 800, unit: "pieces", reorderLevel: 200, status: "In Stock" },
  { id: 11, name: "Stirrers", sku: "STR-001", category: "Utensils", quantity: 1200, unit: "pieces", reorderLevel: 300, status: "In Stock" },
  { id: 12, name: "Napkins", sku: "NAP-001", category: "Utensils", quantity: 40, unit: "packs", reorderLevel: 20, status: "In Stock" },
];

const categories = ["All", "Ingredients", "Packaging", "Utensils", "Equipment", "Merchandise"];

// Define the inventory item interface
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 8;

  // Fetch inventory data
  const { data: inventory, isLoading, isError } = useQuery<InventoryItem[]>({
    queryKey: ["inventory"],
    queryFn: () => {
      // In a real app, this would be an API call
      return new Promise<InventoryItem[]>((resolve) => {
        setTimeout(() => resolve(mockInventory), 500);
      });
    },
  });

  // Sort and filter inventory
  const filteredInventory = inventory
    ? inventory
        .filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.sku.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
          const matchesStatus = statusFilter === "all" || 
                              (statusFilter === "low" && item.status === "Low Stock") ||
                              (statusFilter === "in" && item.status === "In Stock");
          return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
          const aValue = a[sortBy as keyof InventoryItem];
          const bValue = b[sortBy as keyof InventoryItem];
          
          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc" 
              ? aValue.localeCompare(bValue) 
              : bValue.localeCompare(aValue);
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
          return 0;
        })
    : [];

  // Pagination
  const totalPages = Math.ceil((filteredInventory?.length || 0) / itemsPerPage);
  const currentItems = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Count low stock items
  const lowStockCount = inventory?.filter(item => item.status === "Low Stock").length || 0;

  return (
    <MainLayout title="Inventory Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
            </CardContent>
          </Card>

          <Card className={lowStockCount > 0 ? "border-amber-400" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{lowStockCount}</div>
                {lowStockCount > 0 && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">Today, 9:41 AM</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Inventory Items</CardTitle>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <Tabs 
              defaultValue="all" 
              className="mt-4"
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="in">In Stock</TabsTrigger>
                  <TabsTrigger value="low">Low Stock</TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : isError ? (
                  <div className="text-center py-8 text-red-500">
                    Error loading inventory data
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">
                              Item Name
                              {sortBy === "name" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead 
                            className="cursor-pointer"
                            onClick={() => handleSort("category")}
                          >
                            <div className="flex items-center">
                              Category
                              {sortBy === "category" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer text-right"
                            onClick={() => handleSort("quantity")}
                          >
                            <div className="flex items-center justify-end">
                              Quantity
                              {sortBy === "quantity" && (
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Unit</TableHead>
                          <TableHead className="text-right">Reorder Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              No inventory items found
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{item.unit}</TableCell>
                              <TableCell className="text-right">{item.reorderLevel}</TableCell>
                              <TableCell>
                                <Badge variant={item.status === "Low Stock" ? "outline" : "secondary"} className={item.status === "Low Stock" ? "text-amber-600 border-amber-600" : ""}>
                                  {item.status}
                                </Badge>
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
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;
