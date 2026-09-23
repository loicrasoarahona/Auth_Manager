export interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface RoleAttributes {
  id?: number;
  name: string;
}

export interface UserRoleAttributes {
  id?: number;
  user_id: number;
  role_id: number;
}
