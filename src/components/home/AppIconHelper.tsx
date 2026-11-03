import React from 'react';
import {
  ShoppingBag,
  Compass,
  MessageSquare,
  Camera,
  Image,
  Music,
  FileText,
  Calculator,
  CloudSun,
  Clock,
  Settings,
  Gamepad2,
  Folder,
  AppWindow,
} from 'lucide-react';

export const getAppIcon = (iconName: string, className = 'w-6 h-6'): React.ReactNode => {
  switch (iconName) {
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Image':
      return <Image className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Calculator':
      return <Calculator className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Settings':
      return <Settings className={className} />;
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Folder':
      return <Folder className={className} />;
    default:
      return <AppWindow className={className} />;
  }
};
