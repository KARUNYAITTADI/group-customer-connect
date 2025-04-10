
export interface BaseEntity {
  id: string;
  active: boolean;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface ResponseModel<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CustomerGroup extends BaseEntity {
  customerGroupName: string;
  customerGroupStatus: 'active' | 'inactive';
}

export interface CustomerGroupRequestDTO {
  customerGroupName: string;
  customerGroupStatus: 'active' | 'inactive';
}

export type Gender = 'Male' | 'Female' | 'Other';

export interface Customer extends BaseEntity {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  gender: Gender;
  dateOfBirth?: string;
  anniversaryDate?: string;
  address?: string;
  companyName?: string;
  companyAddress?: string;
  gstNumber?: string;
  taxStateCode?: string;
  amountDue: number;
  customerGroupId: string;
  customerGroup?: CustomerGroup;
}

export interface CustomerRequestDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  gender: Gender;
  dateOfBirth?: string;
  anniversaryDate?: string;
  address?: string;
  companyName?: string;
  companyAddress?: string;
  gstNumber?: string;
  taxStateCode?: string;
  amountDue: number;
  customerGroupId: string;
}

export interface CustomerResponseDTO extends Customer {
  customerGroup: CustomerGroup;
}

export interface CustomerFilterParams extends PaginationParams {
  customerGroupId?: string;
  name?: string;
  phoneNumber?: string;
  emailAddress?: string;
  gender?: Gender;
  minAmountDue?: number;
  maxAmountDue?: number;
}

export interface CustomerGroupFilterParams extends PaginationParams {
  status?: 'active' | 'inactive';
  name?: string;
}
