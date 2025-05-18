/**
 * @file services/auth/mockData.ts
 * @description Mock-Daten für Authentifizierung.
 * Teil des Adapter-Patterns für die alte Auth-API.
 */

// Mock-Benutzer für Entwicklungs- und Testzwecke
export const MOCK_USERS = [
  {
    id: 'mock-user-1',
    email: 'demo@example.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'free',
    username: 'demo_user',
    first_name: 'Demo',
    last_name: 'User',
    profile_image: null,
    header_image: null,
    company_name: 'Demo Company',
    headline: 'Demo User Account',
    website: 'https://example.com',
    description: 'This is a demo user account',
    location: 'Demo City',
    industry: 'Technology',
    phone: '+49123456789',
    is_verified: true,
    created_at: '2023-01-01',
    rating: 4.5
  },
  {
    id: 'mock-user-2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    username: 'admin_user',
    first_name: 'Admin',
    last_name: 'User',
    profile_image: null,
    header_image: null,
    company_name: 'Admin Company',
    headline: 'Admin User Account',
    website: 'https://admin-example.com',
    description: 'This is an admin user account',
    location: 'Admin City',
    industry: 'Administration',
    phone: '+49987654321',
    is_verified: true,
    created_at: '2023-01-02',
    rating: 5.0
  }
]; 