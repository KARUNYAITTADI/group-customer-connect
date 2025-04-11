
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
import { Staff } from "@/types/resources";
import { Check, MoreVertical, Plus, Search, Trash, UserCog, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data for staff
const mockStaffData: Staff[] = [
  {
    id: 1,
    name: "Shiva Sai",
    avatar: "",
    email: "shivasai@gmail.com",
    phone: "+91 9123456789",
    role: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Arya Varma",
    avatar: "",
    email: "arya@example.com",
    phone: "+91 9123456789",
    role: "Chef",
    status: "Active",
  },
  {
    id: 3,
    name: "Priya Desai",
    avatar: "",
    email: "priya@gmail.com",
    phone: "+91 9123456789",
    role: "Waiter",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Amit Verma",
    avatar: "",
    email: "amit@example.com", 
    phone: "+91 9123456789",
    role: "Cashier",
    status: "Active",
  },
  {
    id: 5,
    name: "Ravi Malya",
    avatar: "",
    email: "ravi@gmail.com",
    phone: "+91 9123456789",
    role: "Waiter",
    status: "Active",
  },
  {
    id: 6,
    name: "Anjali Verma",
    avatar: "",
    email: "anjali@example.com",
    phone: "+91 9123456789",
    role: "Waiter",
    status: "Inactive",
  },
  {
    id: 7,
    name: "Neha Sharma",
    avatar: "",
    email: "neha@gmail.com", 
    phone: "+91 9123456789",
    role: "Chef",
    status: "Active",
  },
  {
    id: 8,
    name: "Arjun Desai",
    avatar: "",
    email: "arjun@example.com",
    phone: "+91 9123456789",
    role: "Manager",
    status: "Inactive",
  },
];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaffData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Filter staff based on search term and filters
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole ? staff.role === filterRole : true;
    const matchesStatus = filterStatus ? staff.status === filterStatus : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateStaff = () => {
    // In a real app, you would make an API call here
    setIsCreateModalOpen(false);
    setIsAddedModalOpen(true);
    setTimeout(() => setIsAddedModalOpen(false), 2000);
  };

  const handleEditStaff = () => {
    // In a real app, you would make an API call here
    setIsEditModalOpen(false);
    setIsUpdatedModalOpen(true);
    setTimeout(() => setIsUpdatedModalOpen(false), 2000);
  };

  const handleDeleteStaff = () => {
    // In a real app, you would make an API call here
    setIsDeleteModalOpen(false);
    setIsDeletedModalOpen(true);
    setTimeout(() => {
      setIsDeletedModalOpen(false);
      if (currentStaff) {
        setStaffList(staffList.filter(staff => staff.id !== currentStaff.id));
        toast.success("Staff deleted successfully");
      }
    }, 2000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("");
    setFilterStatus("");
  };

  return (
    <MainLayout title="Staff Management">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Staff Listing</div>
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
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Chef">Chef</SelectItem>
                <SelectItem value="Waiter">Waiter</SelectItem>
                <SelectItem value="Cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
            
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
                <TableHead>Staff Name & ID</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff, index) => (
                <TableRow key={staff.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-800">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-xs text-gray-500">ID: {staff.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{staff.email}</div>
                      <div className="text-gray-500">{staff.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={
                      staff.role === "Manager" 
                        ? "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs" 
                        : staff.role === "Chef"
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        : staff.role === "Waiter"
                        ? "bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs"
                        : "bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                    }>
                      {staff.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={
                      staff.status === "Active" 
                        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs" 
                        : "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                    }>
                      {staff.status}
                    </span>
                  </TableCell>
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
                            setCurrentStaff(staff);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setCurrentStaff(staff);
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

      {/* Create Staff Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Staff</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarFallback className="text-2xl">
                  <UserCog />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Upload</Button>
              <span className="text-xs text-gray-500 mt-1">Image should be of JPG/PNG format only</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input id="firstName" placeholder="First Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input id="lastName" placeholder="Last Name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input id="email" type="email" placeholder="Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input id="phone" placeholder="+91 or Phone Number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID*</Label>
              <Input id="userId" placeholder="User ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="chef">Chef</SelectItem>
                  <SelectItem value="waiter">Waiter</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStaff} className="bg-amber-400 hover:bg-amber-500 text-black">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="h-24 w-24 mb-2">
                {currentStaff?.avatar ? (
                  <AvatarImage src={currentStaff.avatar} />
                ) : (
                  <AvatarFallback className="bg-amber-100 text-amber-800 text-xl">
                    {currentStaff?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Upload</Button>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <span className="text-xs text-gray-500 mt-1">Upload Profile Picture (JPG or PNG format only)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input id="firstName" defaultValue={currentStaff?.name.split(' ')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input id="lastName" defaultValue={currentStaff?.name.split(' ')[1] || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input id="email" type="email" defaultValue={currentStaff?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input id="phone" defaultValue={currentStaff?.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">User ID*</Label>
              <Input id="userId" defaultValue={currentStaff?.id.toString()} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select defaultValue={currentStaff?.role.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue placeholder={currentStaff?.role} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="chef">Chef</SelectItem>
                  <SelectItem value="waiter">Waiter</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="offlineAccess" className="rounded text-amber-500" defaultChecked />
              <Label htmlFor="offlineAccess">Allow Offline Access</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff} className="bg-amber-400 hover:bg-amber-500 text-black">
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
            <Button onClick={handleDeleteStaff} variant="destructive">
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
            <p>Staff has been successfully removed.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Added Success Dialog */}
      <Dialog open={isAddedModalOpen} onOpenChange={setIsAddedModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Staff Added</h2>
            <p>New staff created successfully. Login details sent by email.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Updated Success Dialog */}
      <Dialog open={isUpdatedModalOpen} onOpenChange={setIsUpdatedModalOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-6 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Staff Updated</h2>
            <p>Staff details successfully updated.</p>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default StaffManagement;
