export interface SignUpRequest {
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  is_active: boolean;
  is_owner: boolean;
}
