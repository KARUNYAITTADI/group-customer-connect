
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Role, Permission, RoleWithPermissions } from "@/types/resources";
import { Check, MoreVertical, Pencil, Plus, Search, Settings, Shield, Trash, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data for roles
const mockRolesData: Role[] = [
  { id: 1, name: "Manager", status: "Active", staffCount: 3 },
  { id: 2, name: "Chef", status: "Active", staffCount: 20 },
  { id: 3, name: "Assistant", status: "Inactive", staffCount: 8 },
  { id: 4, name: "Kitchen Helper", status: "Active", staffCount: 5 },
  { id: 5, name: "Waiter", status: "Inactive", staffCount: 250 },
  { id: 6, name: "Sales Executive", status: "Active", staffCount: 30 },
];

// Mock modules for permissions
const modules = [
  "Dashboard",
  "Point of Sale",
  "All Orders",
  "Reservations",
  "Catalog",
  "Inventory",
  "Purchase Orders",
  "Customers",
  "Marketing",
  "Analytics & Reports",
  "Manage Resources",
  "Branches",
  "Multiple Kitchens",
  "Administration",
];

const RolesPermissions = () => {
  const [rolesList, setRolesList] = useState<Role[]>(mockRolesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isRoleCreatedModalOpen, setIsRoleCreatedModalOpen] = useState(false);
  const [isRoleUpdatedModalOpen, setIsRoleUpdatedModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(
    modules.map(module => ({
      module,
      create: false,
      edit: false,
      delete: false,
      show: false,
    }))
  );
  const [newRoleName, setNewRoleName] = useState("");
  
  // Filter roles based on search term and filters
  const filteredRoles = rolesList.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? role.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateRole = () => {
    // In a real app, you would make an API call here
    setIsCreateModalOpen(false);
    setIsRoleCreatedModalOpen(true);
    setTimeout(() => setIsRoleCreatedModalOpen(false), 2000);
  };

  const handleEditRole = () => {
    // In a real app, you would make an API call here
    setIsEditModalOpen(false);
    setIsRoleUpdatedModalOpen(true);
    setTimeout(() => setIsRoleUpdatedModalOpen(false), 2000);
  };

  const handleDeleteRole = () => {
    // In a real app, you would make an API call here
    setIsDeleteModalOpen(false);
    setIsDeletedModalOpen(true);
    setTimeout(() => {
      setIsDeletedModalOpen(false);
      if (currentRole) {
        setRolesList(rolesList.filter(role => role.id !== currentRole.id));
        toast.success("Role deleted successfully");
      }
    }, 2000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
  };

  const selectAllPermissions = (type: keyof Permission) => {
    setPermissions(permissions.map(p => ({
      ...p,
      [type]: true,
    })));
  };

  const togglePermission = (moduleIndex: number, type: keyof Permission) => {
    setPermissions(
      permissions.map((permission, index) => 
        index === moduleIndex
          ? { ...permission, [type]: !permission[type] }
          : permission
      )
    );
  };

  return (
    <MainLayout title="Roles & Permissions">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Roles Listing</div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-black"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-amber-400 text-amber-700"
            >
              Clear
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50">
                <TableHead className="w-12">Sr. No.</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Number of Staff</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <span className={
                      role.name === "Manager" 
                        ? "text-blue-600 font-medium" 
                        : role.name === "Chef"
                        ? "text-green-600 font-medium"
                        : role.name === "Waiter"
                        ? "text-amber-600 font-medium"
                        : "text-purple-600 font-medium"
                    }>
                      {role.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={
                      role.status === "Active" 
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs" 
                        : "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                    }>
                      {role.status}
                    </span>
                  </TableCell>
                  <TableCell>{role.staffCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setCurrentRole(role);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setCurrentRole(role);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Role Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role and its permissions.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="mb-4">
              <Label htmlFor="roleName">Role Name*</Label>
              <Input 
                id="roleName" 
                placeholder="Role Name" 
                value={newRoleName} 
                onChange={(e) => setNewRoleName(e.target.value)} 
                className="mb-4"
              />
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Assign Permissions to Role</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50">
                      <TableHead className="w-1/3">MODULE</TableHead>
                      <TableHead className="text-center">
                        <div className="flex flex-col items-center">
                          <span>PERMISSIONS</span>
                          <div className="flex gap-8 mt-1">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('create')}
                            >
                              Create
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('edit')}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('delete')}
                            >
                              Delete
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('show')}
                            >
                              Show
                            </Button>
                          </div>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission, index) => (
                      <TableRow key={permission.module}>
                        <TableCell className="font-medium">{permission.module}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-16">
                            <Checkbox 
                              checked={permission.create} 
                              onCheckedChange={() => togglePermission(index, 'create')}
                            />
                            <Checkbox 
                              checked={permission.edit} 
                              onCheckedChange={() => togglePermission(index, 'edit')}
                            />
                            <Checkbox 
                              checked={permission.delete} 
                              onCheckedChange={() => togglePermission(index, 'delete')}
                            />
                            <Checkbox 
                              checked={permission.show} 
                              onCheckedChange={() => togglePermission(index, 'show')}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} className="bg-amber-400 hover:bg-amber-500 text-black">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-4">
              <Label htmlFor="editRoleName">Role Name*</Label>
              <Input 
                id="editRoleName" 
                defaultValue={currentRole?.name} 
                className="mb-4"
              />
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Assign Permissions to Role</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50">
                      <TableHead className="w-1/3">MODULE</TableHead>
                      <TableHead className="text-center">
                        <div className="flex flex-col items-center">
                          <span>PERMISSIONS</span>
                          <div className="flex gap-8 mt-1">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('create')}
                            >
                              Create
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('edit')}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('delete')}
                            >
                              Delete
                            </Button>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto" 
                              onClick={() => selectAllPermissions('show')}
                            >
                              Show
                            </Button>
                          </div>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission, index) => (
                      <TableRow key={permission.module}>
                        <TableCell className="font-medium">{permission.module}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-16">
                            <Checkbox 
                              checked={permission.create} 
                              onCheckedChange={() => togglePermission(index, 'create')}
                            />
                            <Checkbox 
                              checked={permission.edit} 
                              onCheckedChange={() => togglePermission(index, 'edit')}
                            />
                            <Checkbox 
                              checked={permission.delete} 
                              onCheckedChange={() => togglePermission(index, 'delete')}
                            />
                            <Checkbox 
                              checked={permission.show} 
                              onCheckedChange={() => togglePermission(index, 'show')}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="destructive">Deactivate</Button>
            <div className="flex-grow"></div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} className="bg-amber-400 hover:bg-amber-500 text-black">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-red-500 text-xl">
              <Trash className="h-10 w-10 p-2 bg-red-100 rounded-full mr-2" />
              Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p>This action cannot be undone. Do you want to proceed with deletion?</p>
          </div>
          <DialogFooter className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteRole} variant="destructive">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deleted Success Dialog */}
      <Dialog open={isDeletedModalOpen} onOpenChange={setIsDeletedModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Deleted!</h2>
            <p>Role has been successfully removed.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Created Success Dialog */}
      <Dialog open={isRoleCreatedModalOpen} onOpenChange={setIsRoleCreatedModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Role Created</h2>
            <p>New role created successfully!</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Updated Success Dialog */}
      <Dialog open={isRoleUpdatedModalOpen} onOpenChange={setIsRoleUpdatedModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Role Updated</h2>
            <p>Role permissions updated successfully!</p>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default RolesPermissions;
