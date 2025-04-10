
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, MinusCircle, Trash2, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample product categories and products
const categories = [
  "All", "Food", "Beverages", "Snacks", "Desserts", "Merchandise"
];

const products = [
  { id: 1, name: "Espresso", price: 3.50, category: "Beverages", image: "/placeholder.svg" },
  { id: 2, name: "Cappuccino", price: 4.50, category: "Beverages", image: "/placeholder.svg" },
  { id: 3, name: "Latte", price: 4.75, category: "Beverages", image: "/placeholder.svg" },
  { id: 4, name: "Americano", price: 3.25, category: "Beverages", image: "/placeholder.svg" },
  { id: 5, name: "Chocolate Croissant", price: 3.95, category: "Food", image: "/placeholder.svg" },
  { id: 6, name: "Blueberry Muffin", price: 3.75, category: "Food", image: "/placeholder.svg" },
  { id: 7, name: "Chocolate Chip Cookie", price: 2.50, category: "Snacks", image: "/placeholder.svg" },
  { id: 8, name: "Cheesecake", price: 5.95, category: "Desserts", image: "/placeholder.svg" },
  { id: 9, name: "Ceramic Mug", price: 12.99, category: "Merchandise", image: "/placeholder.svg" },
  { id: 10, name: "Travel Tumbler", price: 24.99, category: "Merchandise", image: "/placeholder.svg" },
];

// Cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  const deleteFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const filteredProducts = products.filter(product => 
    (activeCategory === "All" || product.category === activeCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <MainLayout title="Point of Sale">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Products Section */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-auto pb-1">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="w-full justify-start">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">${product.price.toFixed(2)}</Badge>
                    </div>
                    <CardFooter className="flex justify-between p-2">
                      <div className="text-sm font-medium">{product.name}</div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => addToCart(product)}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shopping Cart</CardTitle>
                <Badge variant="outline" className="text-base">
                  <ShoppingCart className="mr-1 h-4 w-4" /> {totalItems}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[60vh] lg:h-[70vh]">
              <div className="flex-1 overflow-auto mb-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart className="mb-2 h-12 w-12" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add items to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => addToCart(item)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive"
                            onClick={() => deleteFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" disabled={cart.length === 0}>
                Complete Payment
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={clearCart} 
                disabled={cart.length === 0}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default POS;
