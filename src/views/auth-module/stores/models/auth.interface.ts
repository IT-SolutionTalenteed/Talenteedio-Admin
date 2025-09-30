import type { User } from '@/stores/models/user.model';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthResponse {
  success?: true;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ErrorResponse {
  response: {
    status: number;
    statusText: string;
    message: string;
    data: {
      success?: false;
      msg: string;
    };
  };
}

export interface MeResponse {
  user: User;
}

export interface LogoutResponse {
  msg: string;
}
