
import { toast } from "sonner";
import {
  Customer,
  CustomerFilterParams,
  CustomerGroup,
  CustomerGroupFilterParams,
  CustomerGroupRequestDTO,
  CustomerRequestDTO,
  PaginatedResponse,
  ResponseModel
} from "@/types";

// Mock data for customer groups
const customerGroups: CustomerGroup[] = [
  {
    id: "1",
    customerGroupName: "VIP",
    customerGroupStatus: "active",
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    customerGroupName: "Corporate Clients",
    customerGroupStatus: "active",
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  }
];

// Mock data for customers
const customers: Customer[] = [
  {
    id: "1",
    firstName: "Elizabeth",
    lastName: "Baker",
    phoneNumber: "+91 9123456788",
    emailAddress: "elizabeth2@gmail.com",
    gender: "Female",
    dateOfBirth: "2000-02-09",
    customerGroupId: "1",
    amountDue: 1480,
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    firstName: "Mark",
    lastName: "Taylor",
    phoneNumber: "+91 9556345678",
    emailAddress: "taylor09@gmail.com",
    gender: "Male",
    dateOfBirth: "2001-03-08",
    customerGroupId: "2",
    amountDue: 5658,
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  },
  {
    id: "3",
    firstName: "Jackson",
    lastName: "Clark",
    phoneNumber: "+91 9123456788",
    emailAddress: "elizabeth2@gmail.com",
    gender: "Male",
    dateOfBirth: "2000-02-09",
    customerGroupId: "1",
    amountDue: 1480,
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  },
  {
    id: "4",
    firstName: "Anthony",
    lastName: "Moore",
    phoneNumber: "+91 9556345678",
    emailAddress: "taylor09@gmail.com",
    gender: "Male", 
    dateOfBirth: "2001-03-08",
    customerGroupId: "2",
    amountDue: 0,
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  },
  {
    id: "5",
    firstName: "Sarah",
    lastName: "Walker",
    phoneNumber: "+91 9123456788",
    emailAddress: "elizabeth2@gmail.com",
    gender: "Female",
    dateOfBirth: "2000-02-09",
    customerGroupId: "1",
    amountDue: 1480,
    active: true,
    createdBy: "Admin",
    createdOn: "2025-01-01T00:00:00Z",
    modifiedBy: "Admin",
    modifiedOn: "2025-01-01T00:00:00Z"
  }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error handling for API calls
const handleApiError = (error: unknown): ResponseModel<any> => {
  console.error("API Error:", error);
  
  let errorMessage = "An unknown error occurred";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
  
  return {
    data: null,
    message: errorMessage,
    status: 500,
    success: false
  };
};

// Customer Group API
export const customerGroupApi = {
  // Create customer group
  createCustomerGroup: async (data: CustomerGroupRequestDTO): Promise<ResponseModel<CustomerGroup>> => {
    try {
      await delay(500);
      const newGroup: CustomerGroup = {
        ...data,
        id: (customerGroups.length + 1).toString(),
        active: true,
        createdBy: "Admin",
        createdOn: new Date().toISOString(),
        modifiedBy: "Admin",
        modifiedOn: new Date().toISOString()
      };
      customerGroups.push(newGroup);
      
      toast.success("Customer group created successfully");
      
      return {
        data: newGroup,
        message: "Customer group created successfully",
        status: 201,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get customer group by ID
  getCustomerGroupById: async (id: string): Promise<ResponseModel<CustomerGroup>> => {
    try {
      await delay(300);
      const group = customerGroups.find(g => g.id === id);
      
      if (!group) {
        throw new Error("Customer group not found");
      }
      
      return {
        data: group,
        message: "Customer group fetched successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update customer group
  updateCustomerGroup: async (id: string, data: CustomerGroupRequestDTO): Promise<ResponseModel<CustomerGroup>> => {
    try {
      await delay(500);
      const index = customerGroups.findIndex(g => g.id === id);
      
      if (index === -1) {
        throw new Error("Customer group not found");
      }
      
      const updatedGroup: CustomerGroup = {
        ...customerGroups[index],
        ...data,
        modifiedBy: "Admin",
        modifiedOn: new Date().toISOString()
      };
      
      customerGroups[index] = updatedGroup;
      
      toast.success("Customer group updated successfully");
      
      return {
        data: updatedGroup,
        message: "Customer group updated successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete customer group
  deleteCustomerGroup: async (id: string): Promise<ResponseModel<boolean>> => {
    try {
      await delay(500);
      const index = customerGroups.findIndex(g => g.id === id);
      
      if (index === -1) {
        throw new Error("Customer group not found");
      }
      
      customerGroups.splice(index, 1);
      
      toast.success("Customer group deleted successfully");
      
      return {
        data: true,
        message: "Customer group deleted successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all customer groups with filtering, pagination and sorting
  getAllCustomerGroups: async (params: CustomerGroupFilterParams): Promise<ResponseModel<PaginatedResponse<CustomerGroup>>> => {
    try {
      await delay(700);
      
      const { page = 1, pageSize = 10, sortBy = "customerGroupName", sortDirection = "asc", status, name } = params;
      
      let filteredGroups = [...customerGroups];
      
      // Apply filters
      if (status) {
        filteredGroups = filteredGroups.filter(g => g.customerGroupStatus === status);
      }
      
      if (name) {
        const searchTerm = name.toLowerCase();
        filteredGroups = filteredGroups.filter(g => 
          g.customerGroupName.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting
      filteredGroups.sort((a, b) => {
        const aValue = a[sortBy as keyof CustomerGroup];
        const bValue = b[sortBy as keyof CustomerGroup];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
      
      // Apply pagination
      const totalCount = filteredGroups.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedGroups = filteredGroups.slice(startIndex, endIndex);
      
      return {
        data: {
          items: paginatedGroups,
          totalCount,
          pageSize,
          currentPage: page,
          totalPages
        },
        message: "Customer groups fetched successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Customer API
export const customerApi = {
  // Create customer
  createCustomer: async (data: CustomerRequestDTO): Promise<ResponseModel<Customer>> => {
    try {
      await delay(500);
      
      // Check if customer group exists
      const group = customerGroups.find(g => g.id === data.customerGroupId);
      if (!group) {
        throw new Error("Customer group not found");
      }
      
      const newCustomer: Customer = {
        ...data,
        id: (customers.length + 1).toString(),
        active: true,
        createdBy: "Admin",
        createdOn: new Date().toISOString(),
        modifiedBy: "Admin",
        modifiedOn: new Date().toISOString()
      };
      
      customers.push(newCustomer);
      
      toast.success("Customer created successfully");
      
      return {
        data: newCustomer,
        message: "Customer created successfully",
        status: 201,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<ResponseModel<Customer>> => {
    try {
      await delay(300);
      const customer = customers.find(c => c.id === id);
      
      if (!customer) {
        throw new Error("Customer not found");
      }
      
      return {
        data: customer,
        message: "Customer fetched successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update customer
  updateCustomer: async (id: string, data: CustomerRequestDTO): Promise<ResponseModel<Customer>> => {
    try {
      await delay(500);
      const index = customers.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error("Customer not found");
      }
      
      // Check if customer group exists
      const group = customerGroups.find(g => g.id === data.customerGroupId);
      if (!group) {
        throw new Error("Customer group not found");
      }
      
      const updatedCustomer: Customer = {
        ...customers[index],
        ...data,
        modifiedBy: "Admin",
        modifiedOn: new Date().toISOString()
      };
      
      customers[index] = updatedCustomer;
      
      toast.success("Customer updated successfully");
      
      return {
        data: updatedCustomer,
        message: "Customer updated successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete customer
  deleteCustomer: async (id: string): Promise<ResponseModel<boolean>> => {
    try {
      await delay(500);
      const index = customers.findIndex(c => c.id === id);
      
      if (index === -1) {
        throw new Error("Customer not found");
      }
      
      customers.splice(index, 1);
      
      toast.success("Customer deleted successfully");
      
      return {
        data: true,
        message: "Customer deleted successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get all customers with filtering, pagination and sorting
  getAllCustomers: async (params: CustomerFilterParams): Promise<ResponseModel<PaginatedResponse<Customer>>> => {
    try {
      await delay(700);
      
      const { 
        page = 1, 
        pageSize = 10, 
        sortBy = "firstName", 
        sortDirection = "asc", 
        customerGroupId,
        name,
        phoneNumber,
        emailAddress,
        gender,
        minAmountDue,
        maxAmountDue
      } = params;
      
      let filteredCustomers = [...customers];
      
      // Apply filters
      if (customerGroupId) {
        filteredCustomers = filteredCustomers.filter(c => c.customerGroupId === customerGroupId);
      }
      
      if (name) {
        const searchTerm = name.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c => 
          c.firstName.toLowerCase().includes(searchTerm) || 
          c.lastName.toLowerCase().includes(searchTerm)
        );
      }
      
      if (phoneNumber) {
        filteredCustomers = filteredCustomers.filter(c => 
          c.phoneNumber.includes(phoneNumber)
        );
      }
      
      if (emailAddress) {
        const searchTerm = emailAddress.toLowerCase();
        filteredCustomers = filteredCustomers.filter(c => 
          c.emailAddress.toLowerCase().includes(searchTerm)
        );
      }
      
      if (gender) {
        filteredCustomers = filteredCustomers.filter(c => c.gender === gender);
      }
      
      if (minAmountDue !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.amountDue >= minAmountDue);
      }
      
      if (maxAmountDue !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.amountDue <= maxAmountDue);
      }
      
      // Apply sorting
      filteredCustomers.sort((a, b) => {
        const aValue = a[sortBy as keyof Customer];
        const bValue = b[sortBy as keyof Customer];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
      
      // Apply pagination
      const totalCount = filteredCustomers.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
      
      // Enhance with customer group data
      const enhancedCustomers = paginatedCustomers.map(customer => {
        const group = customerGroups.find(g => g.id === customer.customerGroupId);
        return {
          ...customer,
          customerGroup: group
        };
      });
      
      return {
        data: {
          items: enhancedCustomers,
          totalCount,
          pageSize,
          currentPage: page,
          totalPages
        },
        message: "Customers fetched successfully",
        status: 200,
        success: true
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
