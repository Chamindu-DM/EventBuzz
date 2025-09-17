import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  university: string;
  studentId?: string;
  bio?: string;
  year?: string;
  major?: string;
  skills?: string[];
  interests?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  profileImage?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  createUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUser: User = {
  id: '1',
  email: 'john.doe@university.edu',
  firstName: 'John',
  lastName: 'Doe',
  university: 'Stanford University',
  studentId: '12345678',
  bio: 'Computer Science student passionate about AI and web development.',
  year: 'Junior',
  major: 'Computer Science',
  skills: ['JavaScript', 'React', 'Python', 'Machine Learning'],
  interests: 'Building innovative solutions to real-world problems',
  githubUsername: 'johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  portfolioUrl: 'https://johndoe.dev',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  createdAt: new Date()
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = async () => {
      try {
        // TODO: Replace with actual API call to check authentication status
        // const response = await fetch('/api/auth/me');
        // if (response.ok) {
        //   const userData = await response.json();
        //   setUser(userData);
        // }
        
        // For demo, check localStorage for saved user
        const savedUser = localStorage.getItem('eventwall_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      // 
      // const userData = await response.json();
      
      // For demo, use mock user if credentials match
      if (credentials.email === mockUser.email) {
        setUser(mockUser);
        localStorage.setItem('eventwall_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // TODO: Add API call to invalidate session
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    setUser(null);
    localStorage.removeItem('eventwall_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('eventwall_user', JSON.stringify(updatedUser));
      
      // TODO: Add API call to update user data
      // await fetch('/api/users/me', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
    }
  };

  const createUser = (userData: any) => {
    const newUser: User = {
      id: Date.now().toString(), // In real app, this would come from backend
      ...userData,
      createdAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('eventwall_user', JSON.stringify(newUser));
    
    // TODO: Add API call to create user account
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    createUser
  };

  return (
    <AuthContext.Provider value={value}>
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

// Backend API endpoints that need to be implemented:
/*
POST /api/auth/register
  - Create new user account
  - Send email verification
  - Return user data and auth token

POST /api/auth/login
  - Authenticate user
  - Return user data and auth token

POST /api/auth/logout
  - Invalidate session/token

GET /api/auth/me
  - Get current user data
  - Verify authentication status

PATCH /api/users/me
  - Update user profile
  - Handle profile image upload

POST /api/auth/forgot-password
  - Send password reset email

POST /api/auth/reset-password
  - Reset password with token

POST /api/auth/verify-email
  - Verify email address with token

GET /api/auth/refresh
  - Refresh authentication token
*/