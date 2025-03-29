import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth';
import { AuthService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const user = await AuthService.getCurrentUser(token);
        setState(prev => ({ ...prev, user, token, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Error al cargar la sesión', isLoading: false }));
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await AuthService.login(credentials);
      await AsyncStorage.setItem('token', token);
      setState(prev => ({ ...prev, user, token, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al iniciar sesión',
        isLoading: false,
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await AuthService.register(data);
      await AsyncStorage.setItem('token', token);
      setState(prev => ({ ...prev, user, token, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al registrarse',
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await AuthService.logout();
      await AsyncStorage.removeItem('token');
      setState({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error al cerrar sesión',
        isLoading: false,
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 