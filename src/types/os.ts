export type AppId =
  | 'store'
  | 'browser'
  | 'messages'
  | 'camera'
  | 'gallery'
  | 'music'
  | 'notes'
  | 'calculator'
  | 'weather'
  | 'clock'
  | 'settings'
  | 'game'
  | 'files'
  | 'tottalynotahack';

export type AppCategory = 'system' | 'social' | 'tools' | 'entertainment' | 'productivity';

export type OSBootState = 'booting' | 'boot_options' | 'welcome' | 'running' | 'power_off';

export interface UserLocation {
  latitude: number | null;
  longitude: number | null;
  city: string;
  country: string;
  temperature: number | null;
  condition: string;
  isRealLocation: boolean;
  loading: boolean;
}

export interface AppMetadata {
  id: AppId;
  name: string;
  icon: string;
  gradient: string;
  category: AppCategory;
  isPreinstalled: boolean;
  isInstalled: boolean;
  version: string;
  rating: number;
  reviewsCount: number;
  downloadSize: string;
  description: string;
  shortDescription: string;
  badgeCount?: number;
  isMalware?: boolean;
}

export interface OSNotification {
  id: string;
  appId: AppId;
  appName: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface WallpaperOption {
  id: string;
  name: string;
  type: 'mesh' | 'gradient' | 'image';
  preview: string;
  value: string;
}

export interface OSSettings {
  wallpaper: string;
  navigationMode: '3-button' | 'gestures';
  blurIntensity: 'subtle' | 'medium' | 'deep';
  theme: 'dark' | 'light';
  soundsEnabled: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  airplaneMode: boolean;
  flashlight: boolean;
  brightness: number;
  volume: number;
  dnd: boolean;
  username: string;
  useRealLocation: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

export interface MessageItem {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export interface MessageContact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: MessageItem[];
}

export interface PhotoItem {
  id: string;
  url: string;
  date: string;
  caption?: string;
  filter?: string;
}
