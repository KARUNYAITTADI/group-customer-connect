
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Calendar as CalendarIcon, Plus, Eye, MoreHorizontal } from "lucide-react";

// Sample reservation data
const mockReservations = [
  { id: "RES-001", customer: "John Smith", date: "2025-04-10", time: "18:30", guests: 4, status: "confirmed", phone: "555-123-4567" },
  { id: "RES-002", customer: "Sarah Johnson", date: "2025-04-10", time: "19:00", guests: 2, status: "confirmed", phone: "555-234-5678" },
  { id: "RES-003", customer: "Michael Brown", date: "2025-04-11", time: "12:30", guests: 6, status: "pending", phone: "555-345-6789" },
  { id: "RES-004", customer: "Emma Wilson", date: "2025-04-11", time: "13:00", guests: 3, status: "confirmed", phone: "555-456-7890" },
  { id: "RES-005", customer: "David Lee", date: "2025-04-12", time: "19:30", guests: 2, status: "cancelled", phone: "555-567-8901" },
  { id: "RES-006", customer: "Amanda Clark", date: "2025-04-12", time: "20:00", guests: 4, status: "confirmed", phone: "555-678-9012" },
  { id: "RES-007", customer: "Robert Garcia", date: "2025-04-13", time: "18:00", guests: 5, status: "pending", phone: "555-789-0123" },
  { id: "RES-008", customer: "Jennifer Lopez", date: "2025-04-13", time: "19:00", guests: 2, status: "confirmed", phone: "555-890-1234" },
  { id: "RES-009", customer: "William Taylor", date: "2025-04-14", time: "12:00", guests: 3, status: "pending", phone: "555-901-2345" },
  { id: "RES-010", customer: "Elizabeth Martin", date: "2025-04-14", time: "13:30", guests: 6, status: "confirmed", phone: "555-012-3456" },
  { id: "RES-011", customer: "James Anderson", date: "2025-04-15", time: "19:00", guests: 2, status: "cancelled", phone: "555-123-4567" },
  { id: "RES-012", customer: "Patricia Thomas", date: "2025-04-15", time: "20:00", guests: 4, status: "confirmed", phone: "555-234-5678" },
];

// Status color map
const statusColorMap: Record<string, string> = {
  confirmed: "bg-green-500",
  pending: "bg-yellow-500",
  cancelled: "bg-red-500",
};

const Reservations = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Simulating data fetching with React Query
  const { data: reservations, isLoading, isError } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => {
      // In a real app, this would be an API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockReservations), 500);
      });
    },
  });

  // Filter reservations
  const filteredReservations = reservations
    ? reservations.filter((reservation) => {
        const matchesSearch = reservation.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              reservation.phone.includes(searchTerm);
        const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
        const matchesDate = !date || reservation.date === format(date, "yyyy-MM-dd");
        return matchesSearch && matchesStatus && matchesDate;
      })
    : [];

  // Pagination
  const indexOfLastReservation = currentPage * itemsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - itemsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  return (
    <MainLayout title="Reservations">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="mb-4">
            <Tabs defaultValue="all" onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All Reservations</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Reservations</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customer or phone..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Reservation
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading reservations...</p>
                </div>
              ) : isError ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-red-500">Error loading reservations. Please try again.</p>
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Reservation ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Guests</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentReservations.length > 0 ? (
                          currentReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-medium">{reservation.id}</TableCell>
                              <TableCell>{reservation.customer}</TableCell>
                              <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                              <TableCell>{reservation.time}</TableCell>
                              <TableCell className="text-right">{reservation.guests}</TableCell>
                              <TableCell>{reservation.phone}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={`${statusColorMap[reservation.status]} text-white`}
                                >
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
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
                            <TableCell colSpan={8} className="text-center py-8">
                              No reservations found for the selected date or filters
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" /> Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto p-0"
              />
              <div className="mt-4">
                <h3 className="font-medium mb-2">Today's Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Reservations:</span>
                    <Badge>12</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Confirmed:</span>
                    <Badge className="bg-green-500">8</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <Badge className="bg-yellow-500">3</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled:</span>
                    <Badge className="bg-red-500">1</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reservations;
