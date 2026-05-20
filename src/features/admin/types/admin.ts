export interface RoleListItem {
  id: string;
  name: string;
  isDeleted: boolean;
}

export interface RoleDetails extends RoleListItem {
  permissions: string[];
}

export interface CreateRoleRequest {
  name: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  name: string;
  permissions: string[];
}

export interface AdminUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDisabled: boolean;
  roles: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roles: string[];
}
