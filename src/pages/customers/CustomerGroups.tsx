
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Edit, 
  MoreVertical, 
  Plus, 
  Search, 
  Trash 
} from "lucide-react";
import { customerGroupApi } from "@/lib/api";
import { CustomerGroup, CustomerGroupFilterParams, CustomerGroupRequestDTO } from "@/types";
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
import { CustomerGroupForm } from "@/components/customer-groups/CustomerGroupForm";
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

export default function CustomerGroups() {
  const queryClient = useQueryClient();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });
  
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  
  // Queries
  const { data: groupsData, isLoading } = useQuery({
    queryKey: ["customerGroups", searchTerm, filterStatus, currentPage, pageSize],
    queryFn: () => {
      const params: CustomerGroupFilterParams = {
        page: currentPage,
        pageSize,
        name: searchTerm || undefined,
        status: filterStatus,
      };
      return customerGroupApi.getAllCustomerGroups(params);
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CustomerGroupRequestDTO) => {
      return customerGroupApi.createCustomerGroup(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] });
      setIsFormOpen(false);
      setSuccessMessage({
        title: "Customer Group Added",
        message: "New customer group added successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerGroupRequestDTO }) => {
      return customerGroupApi.updateCustomerGroup(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] });
      setIsFormOpen(false);
      setSuccessMessage({
        title: "Customer Group Updated",
        message: "Customer group updated successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return customerGroupApi.deleteCustomerGroup(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] });
      setIsDeleteDialogOpen(false);
      setSuccessMessage({
        title: "Customer Group Deleted",
        message: "Customer group deleted successfully.",
      });
      setIsSuccessDialogOpen(true);
    },
  });

  // Handlers
  const handleOpenCreateForm = () => {
    setSelectedGroup(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (group: CustomerGroup) => {
    setSelectedGroup(group);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (group: CustomerGroup) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateOrUpdateGroup = (data: CustomerGroupRequestDTO) => {
    if (formMode === "create") {
      createMutation.mutate(data);
    } else if (selectedGroup) {
      updateMutation.mutate({ id: selectedGroup.id, data });
    }
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      deleteMutation.mutate(selectedGroup.id);
    }
  };

  // Create pagination
  const renderPagination = () => {
    if (!groupsData?.data) return null;
    
    const { currentPage, totalPages } = groupsData.data;
    
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
      <Tabs defaultValue="customer-groups" className="w-full">
        <TabsList>
          <TabsTrigger value="customers" asChild>
            <a href="/customers">Customers</a>
          </TabsTrigger>
          <TabsTrigger value="customer-groups">Customers Group</TabsTrigger>
        </TabsList>
        <TabsContent value="customer-groups" className="mt-6">
          <div className="bg-white rounded-md shadow">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Customers Group</h2>
              <Button 
                onClick={handleOpenCreateForm}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
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
                  <span className="text-sm whitespace-nowrap">Filter by Status</span>
                  <Select
                    value={filterStatus || "all"}
                    onValueChange={(value) => setFilterStatus(value === "all" ? undefined : value as "active" | "inactive")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus(undefined);
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
                      <th className="p-3 text-left text-sm font-medium">Customer Group</th>
                      <th className="p-3 text-left text-sm font-medium">Status</th>
                      <th className="p-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center">Loading...</td>
                      </tr>
                    ) : groupsData?.data.items && groupsData.data.items.length > 0 ? (
                      groupsData.data.items.map((group, index) => (
                        <tr key={group.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{group.customerGroupName}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                group.customerGroupStatus === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {group.customerGroupStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenEditForm(group)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleOpenDeleteDialog(group)}
                                  className="text-red-600"
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center">
                          No customer groups found
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
      <CustomerGroupForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateOrUpdateGroup}
        initialData={selectedGroup || undefined}
        mode={formMode}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteGroup}
        title="Delete Customer Group"
        description="Are you sure you want to delete this customer group? This action cannot be undone."
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
