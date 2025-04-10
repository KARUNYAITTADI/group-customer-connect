import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Edit,
  Eye,
  FileDown,
  FileUp,
  MoreVertical, 
  Plus, 
  Search, 
  Trash 
} from "lucide-react";
import { customerApi, customerGroupApi } from "@/lib/api";
import { Customer, CustomerFilterParams, CustomerGroup, CustomerRequestDTO } from "@/types";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { DeleteConfirmationDialog } from "@/components/customer-groups/DeleteConfirmationDialog";
import { SuccessDialog } from "@/components/SuccessDialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Customers() {
  const queryClient = useQueryClient();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroupId, setFilterGroupId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  
  // Queries
  const { data: customersData, isLoading } = useQuery({
    queryKey: ["customers", searchTerm, filterGroupId, currentPage, pageSize],
    queryFn: () => {
      const params: CustomerFilterParams = {
        page: currentPage,
        pageSize,
        name: searchTerm || undefined,
        customerGroupId: filterGroupId,
      };
      return customerApi.getAllCustomers(params);
    },
  });

  const { data: groupsData } = useQuery({
    queryKey: ["customerGroups"],
    queryFn: () => {
      return customerGroupApi.getAllCustomerGroups({
        page: 1,
        pageSize: 100,
      });
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CustomerRequestDTO) => {
      return customerApi.createCustomer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      setSuccessMessage({
        title: "Customer Added",
        message: "New Customer added successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerRequestDTO }) => {
      return customerApi.updateCustomer(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsFormOpen(false);
      setSuccessMessage({
        title: "Customer Updated",
        message: "Customer updated successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return customerApi.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsDeleteDialogOpen(false);
      setSuccessMessage({
        title: "Customer Deleted",
        message: "Customer deleted successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  // Handlers
  const handleOpenCreateForm = () => {
    setSelectedCustomer(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleOpenViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  const handleOpenDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateOrUpdateCustomer = (data: CustomerRequestDTO) => {
    if (formMode === "create") {
      createMutation.mutate(data);
    } else if (selectedCustomer) {
      updateMutation.mutate({ id: selectedCustomer.id, data });
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      deleteMutation.mutate(selectedCustomer.id);
    }
  };

  // Get customer group name by ID
  const getCustomerGroupName = (groupId: string): CustomerGroup | undefined => {
    return groupsData?.data.items.find((group) => group.id === groupId);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Create pagination
  const renderPagination = () => {
    if (!customersData?.data) return null;
    
    const { currentPage, totalPages } = customersData.data;
    
    const paginationItems = [];
    
    // Previous button
    paginationItems.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    if (startPage > 1) {
      paginationItems.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        paginationItems.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      paginationItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    paginationItems.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );
    
    return (
      <Pagination>
        <PaginationContent>{paginationItems}</PaginationContent>
      </Pagination>
    );
  };

  return (
    <MainLayout title="Customers">
      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="customer-groups" asChild>
            <a href="/customer-groups">Customers Group</a>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="customers" className="mt-6">
          <div className="bg-white rounded-md shadow">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Customers Listing</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="border-amber-400 text-amber-600 hover:bg-amber-50"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button 
                  variant="outline"
                  className="border-amber-400 text-amber-600 hover:bg-amber-50"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  onClick={handleOpenCreateForm}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">Filter by Group</span>
                  <Select
                    value={filterGroupId || ""}
                    onValueChange={(value) => setFilterGroupId(value || undefined)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Groups</SelectItem>
                      {groupsData?.data.items.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.customerGroupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterGroupId(undefined);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-100">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium">Sl. No.</th>
                      <th className="p-3 text-left text-sm font-medium">Customer Name</th>
                      <th className="p-3 text-left text-sm font-medium">Phone Number</th>
                      <th className="p-3 text-left text-sm font-medium">Email Address</th>
                      <th className="p-3 text-left text-sm font-medium">Gender</th>
                      <th className="p-3 text-left text-sm font-medium">DOB</th>
                      <th className="p-3 text-left text-sm font-medium">Customer Group</th>
                      <th className="p-3 text-left text-sm font-medium">Amount Due</th>
                      <th className="p-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={9} className="p-4 text-center">Loading...</td>
                      </tr>
                    ) : customersData?.data.items && customersData.data.items.length > 0 ? (
                      customersData.data.items.map((customer, index) => {
                        const customerGroup = customer.customerGroup;
                        return (
                          <tr key={customer.id} className="border-b hover:bg-muted/30">
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{`${customer.firstName} ${customer.lastName}`}</td>
                            <td className="p-3">{customer.phoneNumber}</td>
                            <td className="p-3">{customer.emailAddress}</td>
                            <td className="p-3">{customer.gender}</td>
                            <td className="p-3">{formatDate(customer.dateOfBirth)}</td>
                            <td className="p-3">
                              {customerGroup && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    customerGroup.customerGroupName === "VIP" 
                                      ? "bg-purple-100 text-purple-800" 
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {customerGroup.customerGroupName}
                                </span>
                              )}
                            </td>
                            <td className="p-3">{formatCurrency(customer.amountDue)}</td>
                            <td className="p-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenViewDetails(customer)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenEditForm(customer)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleOpenDeleteDialog(customer)}
                                    className="text-red-600"
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-4 text-center">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-center">
                {renderPagination()}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms and Dialogs */}
      <CustomerForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateOrUpdateCustomer}
        initialData={selectedCustomer || undefined}
        mode={formMode}
        customerGroups={groupsData?.data.items || []}
      />

      <CustomerDetails
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        customer={selectedCustomer}
        customerGroup={selectedCustomer ? getCustomerGroupName(selectedCustomer.customerGroupId) : null}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
      />

      <SuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        title={successMessage.title}
        message={successMessage.message}
      />
    </MainLayout>
  );
}
