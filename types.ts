
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum Permission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  MANAGE_FINANCE = 'MANAGE_FINANCE',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_ADS = 'MANAGE_ADS'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  status?: 'active' | 'blocked' | 'banned';
  subscription?: string; // 'free', 'premium', 'vip'
  permissions?: Permission[]; // For granular access control
  // Enhanced Tracking
  ip?: string;
  lastLogin?: string;
  country?: string;
  device?: string;
  os?: string;
  region?: string;
}

export interface UserActivity {
  id: string;
  action: string; // e.g., "Scanned Video", "Updated Profile"
  timestamp: string;
  details: string;
}

export interface Actor {
  name: string;
  filmography: string[];
  similarMovies: string[];
}

export interface MovieResult {
  title: string;
  year: string;
  director: string;
  productionCompany?: string; // New
  timestamp?: string; // New: Scene timestamp e.g. "01:14:20"
  trailerUrl?: string; // New
  cast: string[];
  genre: string[];
  plot: string;
  confidence: number;
  streaming: string[];
  imageUrl?: string;
  actors?: Actor[];
}

export interface MusicResult {
  title: string;
  artist: string;
  album: string;
  genre: string;
  year: string;
  lyricsSnippet?: string;
  streaming: string[];
  coverUrl?: string;
}

export interface Reel {
  id: string;
  user: string;
  videoUrl: string; // Placeholder for demo
  thumbnail: string;
  likes: number;
  description: string;
  tags: string[];
}

export interface StatMetric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  active: boolean;
  highlight: boolean;
  cta: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  amount: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextBilling: string;
}

export interface ApiConfig {
  key: string;
  provider: string; 
  value: string; // For keys/secrets
  extra?: string; // For regions/endpoints
  label: string;
  category: 'payment' | 'storage' | 'notification' | 'ai';
}

// Monetization
export interface AdCampaign {
  id: string;
  clientName: string;
  type: 'banner' | 'video_preroll' | 'interstitial';
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  budget: string;
  spent: string;
  startDate: string;
  endDate: string;
}

// Communication
export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  lastUpdated: string;
}

// Security
export interface AccessRule {
  id: string;
  type: 'ip' | 'country' | 'device' | 'os' | 'region';
  value: string;
  action: 'block' | 'allow'; // usually block for this context
  reason: string;
  dateAdded: string;
}

// Content Management (CMS)
export interface SiteContent {
  aboutUs: string;
  contactUs: string;
  termsOfService: string;
  privacyPolicy: string;
  refundPolicy: string;
  hologramUrl?: string; // New field for Landing page trailer
}
