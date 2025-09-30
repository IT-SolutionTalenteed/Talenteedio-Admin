import authApi from '../../api/auth.api';

import type {
  ErrorResponse,
  LoginPayload,
  AuthResponse,
  MeResponse,
  RefreshTokenPayload,
  LogoutResponse
} from '../models/auth.interface';

export const login = async (payload: LoginPayload) => {
  try {
    const { data }: { data: AuthResponse } = await authApi.post('login', payload);

    return { data, error: undefined };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: error as ErrorResponse };
  }
};

export const me = async () => {
  try {
    const { data }: { data: MeResponse } = await authApi.get('me');

    return { data, error: undefined };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: error as ErrorResponse };
  }
};

export const reloadToken = async (payload: RefreshTokenPayload) => {
  try {
    const { data }: { data: AuthResponse } = await authApi.post('refresh-token', payload);

    return { data, error: undefined };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: error as ErrorResponse };
  }
};

export const logout = async () => {
  try {
    const { data }: { data: LogoutResponse } = await authApi.post('logout');

    return { data, error: undefined };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: error as ErrorResponse };
  }
};
