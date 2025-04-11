
export interface Staff {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Role {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  staffCount: number;
}

export interface Permission {
  module: string;
  create: boolean;
  edit: boolean;
  delete: boolean;
  show: boolean;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
