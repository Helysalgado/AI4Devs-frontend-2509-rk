/**
 * API Configuration
 * 
 * Centralized API base URL configuration for all services.
 * Uses environment variable REACT_APP_API_BASE_URL or defaults to localhost.
 * 
 * Usage:
 *   import { API_BASE_URL } from '../config/api';
 * 
 * Environment variable setup:
 *   - Development: REACT_APP_API_BASE_URL=http://localhost:3010
 *   - Staging: REACT_APP_API_BASE_URL=https://api-staging.example.com
 *   - Production: REACT_APP_API_BASE_URL=https://api.example.com
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3010';

