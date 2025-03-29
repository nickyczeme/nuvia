import { LoginCredentials, RegisterData, User } from '../types/auth';

const API_URL = 'http://localhost:8000/api';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Error en el inicio de sesión');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en el registro');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    // Implement logout logic here if needed
    return Promise.resolve();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener el usuario');
    }

    return response.json();
  },
}; 