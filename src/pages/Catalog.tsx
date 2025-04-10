
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Plus, Filter, Grid3X3, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample product data
const mockProducts = [
  { id: 1, name: "Espresso", category: "Beverages", price: 3.50, status: "active", sku: "BEV-001", image: "/placeholder.svg" },
  { id: 2, name: "Cappuccino", category: "Beverages", price: 4.50, status: "active", sku: "BEV-002", image: "/placeholder.svg" },
  { id: 3, name: "Latte", category: "Beverages", price: 4.75, status: "active", sku: "BEV-003", image: "/placeholder.svg" },
  { id: 4, name: "Americano", category: "Beverages", price: 3.25, status: "active", sku: "BEV-004", image: "/placeholder.svg" },
  { id: 5, name: "Chocolate Croissant", category: "Food", price: 3.95, status: "active", sku: "FOOD-001", image: "/placeholder.svg" },
  { id: 6, name: "Blueberry Muffin", category: "Food", price: 3.75, status: "active", sku: "FOOD-002", image: "/placeholder.svg" },
  { id: 7, name: "Chocolate Chip Cookie", category: "Snacks", price: 2.50, status: "active", sku: "SNACK-001", image: "/placeholder.svg" },
  { id: 8, name: "Cheesecake", category: "Desserts", price: 5.95, status: "inactive", sku: "DES-001", image: "/placeholder.svg" },
  { id: 9, name: "Ceramic Mug", category: "Merchandise", price: 12.99, status: "active", sku: "MERCH-001", image: "/placeholder.svg" },
  { id: 10, name: "Travel Tumbler", category: "Merchandise", price: 24.99, status: "active", sku: "MERCH-002", image: "/placeholder.svg" },
  { id: 11, name: "Cold Brew", category: "Beverages", price: 4.25, status: "active", sku: "BEV-005", image: "/placeholder.svg" },
  { id: 12, name: "Tea Latte", category: "Beverages", price: 4.50, status: "inactive", sku: "BEV-006", image: "/placeholder.svg" },
];

// Product categories
const categories = [
  "All", "Beverages", "Food", "Snacks", "Desserts", "Merchandise"
];

// Define the Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: string;
  sku: string;
  image: string;
}

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  // Simulating data fetching with React Query
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => {
      // In a real app, this would be an API call
      return new Promise<Product[]>((resolve) => {
        setTimeout(() => resolve(mockProducts), 500);
      });
    },
  });

  // Filter and sort products
  const filteredProducts = products
    ? products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  // Pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <MainLayout title="Catalog">
      <div className="mb-4">
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Products</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex rounded-md border">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewMode === "grid" ? "bg-muted" : ""}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewMode === "list" ? "bg-muted" : ""}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error loading products. Please try again.</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                          <Badge 
                            className={`absolute top-2 right-2 ${product.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">SKU: {product.sku}</p>
                          <Button className="w-full mt-4" variant="outline">Edit</Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">SKU</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-right p-4 font-medium">Price</th>
                        <th className="text-center p-4 font-medium">Status</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                          <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-10 h-10 object-cover rounded-md mr-3"
                                />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="p-4">{product.sku}</td>
                            <td className="p-4">
                              <Badge variant="outline">{product.category}</Badge>
                            </td>
                            <td className="p-4 text-right">${product.price.toFixed(2)}</td>
                            <td className="p-4 text-center">
                              <Badge 
                                className={product.status === "active" ? "bg-green-500" : "bg-red-500"}
                              >
                                {product.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Button size="sm" variant="outline">Edit</Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-8">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
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

export default Catalog;
