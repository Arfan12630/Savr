import axios from 'axios';
import { SignUpRequest, User } from '../types/api';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<User> => {
    const response = await apiClient.post<User>('/registration/signup', data);
    return response.data;
  },
  signIn: async (data: any): Promise<User> => {
    const response = await apiClient.post<User>('/registration/signin', data);
    return response.data;
  },
};

export default apiClient;
