import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AppId,
  AppMetadata,
  OSSettings,
  OSNotification,
  WallpaperOption,
  OSBootState,
  UserLocation,
} from '../types/os';
import { ALL_APPS, INITIAL_WALLPAPERS, INITIAL_NOTIFICATIONS } from '../data/osData';
import { sounds } from '../utils/sound';

interface OSContextType {
  // Boot & System State
  bootState: OSBootState;
  bootProgress: number;
  bootStatusText: string;
  setBootState: (state: OSBootState) => void;
  restartSystem: () => void;
  powerOffSystem: () => void;
  powerOnSystem: () => void;
  factoryReset: () => void;
  completeWelcomeWizard: (customName: string, wallpaperId: string, navMode: '3-button' | 'gestures') => void;

  // App & Window State
  apps: AppMetadata[];
  activeAppId: AppId | null;
  runningApps: AppId[];
  isRecentsOpen: boolean;
  isControlCenterOpen: boolean;
  isPowerMenuOpen: boolean;
  isAppDrawerOpen: boolean;
  isLockScreen: boolean;

  // Settings & OS Status
  settings: OSSettings;
  wallpapers: WallpaperOption[];
  currentWallpaper: WallpaperOption;
  notifications: OSNotification[];
  currentTime: Date;
  batteryLevel: number;
  isCharging: boolean;
  userLocation: UserLocation;

  // Actions
  openApp: (id: AppId) => void;
  closeCurrentApp: () => void;
  toggleRecents: (open?: boolean) => void;
  killApp: (id: AppId) => void;
  clearAllRecents: () => void;
  handleBackAction: () => void;
  registerBackHandler: (handler: () => boolean) => () => void;
  installApp: (id: AppId) => Promise<void>;
  uninstallApp: (id: AppId) => void;
  updateSettings: (partial: Partial<OSSettings>) => void;
  toggleLock: (locked?: boolean) => void;
  toggleControlCenter: (open?: boolean) => void;
  togglePowerMenu: (open?: boolean) => void;
  toggleAppDrawer: (open?: boolean) => void;
  addNotification: (notif: { appId: AppId; title: string; body: string }) => void;
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;
  refreshLocation: () => void;

  // Antivirus & Virus Payload State
  isAntivirusAlertOpen: boolean;
  isGlitching: boolean;
  isCorruptedRecovery: boolean;
  triggerAntivirusAlert: () => void;
  quarantineVirus: () => void;
  bypassAntivirusAndInstall: () => Promise<void>;
  triggerVirusPayload: () => void;
}

const DEFAULT_SETTINGS: OSSettings = {
  wallpaper: 'aurora-dream',
  navigationMode: '3-button',
  blurIntensity: 'medium',
  theme: 'dark',
  soundsEnabled: true,
  wifiEnabled: true,
  bluetoothEnabled: true,
  airplaneMode: false,
  flashlight: false,
  brightness: 90,
  volume: 75,
  dnd: false,
  username: 'TestOS Explorer',
  useRealLocation: true,
};

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Boot sequence state
  const [bootState, setBootState] = useState<OSBootState>('booting');
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatusText, setBootStatusText] = useState('Initializing TestOS Kernel...');

  // Setup completion state from localStorage
  const isFirstRun = typeof window !== 'undefined' && localStorage.getItem('testos_welcome_completed') !== 'true';

  // Apps and settings
  const [apps, setApps] = useState<AppMetadata[]>(() => {
    try {
      const saved = localStorage.getItem('testos_apps');
      if (saved) {
        const parsed: AppMetadata[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((a) => a.id));
        const missing = ALL_APPS.filter((a) => !existingIds.has(a.id));
        const merged = [...parsed, ...missing];
        return merged;
      }
    } catch {}
    return ALL_APPS;
  });

  const [settings, setSettings] = useState<OSSettings>(() => {
    try {
      const saved = localStorage.getItem('testos_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [runningApps, setRunningApps] = useState<AppId[]>(['browser', 'store']);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isAntivirusAlertOpen, setIsAntivirusAlertOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isCorruptedRecovery, setIsCorruptedRecovery] = useState(false);

  const [notifications, setNotifications] = useState<OSNotification[]>(INITIAL_NOTIFICATIONS);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [batteryLevel] = useState(88);
  const [isCharging] = useState(true);

  // Real location state
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: null,
    longitude: null,
    city: 'San Francisco',
    country: 'USA',
    temperature: 72,
    condition: 'Partly Sunny',
    isRealLocation: false,
    loading: false,
  });

  const backHandlersRef = useRef<Array<() => boolean>>([]);

  // Sync sound setting
  useEffect(() => {
    sounds.setEnabled(settings.soundsEnabled);
  }, [settings.soundsEnabled]);

  // Persist apps and settings
  useEffect(() => {
    try {
      localStorage.setItem('testos_apps', JSON.stringify(apps));
    } catch {}
  }, [apps]);

  useEffect(() => {
    try {
      localStorage.setItem('testos_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real geolocation
  const fetchRealLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    setUserLocation((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // 1. Fetch real weather from Open-Meteo (free, no API key needed)
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
          );
          const weatherData = await weatherRes.json();
          const temp = Math.round(weatherData.current_weather?.temperature ?? 70);
          const weatherCode = weatherData.current_weather?.weathercode ?? 0;

          // Weather condition description
          let condition = 'Sunny';
          if (weatherCode > 0 && weatherCode <= 3) condition = 'Partly Cloudy';
          else if (weatherCode >= 45 && weatherCode <= 48) condition = 'Foggy';
          else if (weatherCode >= 51 && weatherCode <= 67) condition = 'Rainy';
          else if (weatherCode >= 71) condition = 'Snow';

          // 2. Fetch approximate city name via reverse geocode
          let cityName = 'Current Location';
          let countryName = '';
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
            );
            const geoData = await geoRes.json();
            cityName =
              geoData.address?.city ||
              geoData.address?.town ||
              geoData.address?.county ||
              geoData.address?.state ||
              'Current Location';
            countryName = geoData.address?.country || '';
          } catch {}

          setUserLocation({
            latitude: lat,
            longitude: lon,
            city: cityName,
            country: countryName,
            temperature: temp,
            condition,
            isRealLocation: true,
            loading: false,
          });
        } catch {
          setUserLocation((prev) => ({ ...prev, isRealLocation: true, loading: false }));
        }
      },
      () => {
        // Fallback default
        setUserLocation((prev) => ({
          ...prev,
          city: 'San Francisco',
          country: 'CA, USA',
          temperature: 72,
          condition: 'Mostly Sunny',
          isRealLocation: false,
          loading: false,
        }));
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    fetchRealLocation();
  }, []);

  // Boot sequence animation
  useEffect(() => {
    if (bootState !== 'booting') return;

    setBootProgress(0);
    setBootStatusText('Initializing TestOS Kernel...');

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next < 25) {
          setBootStatusText('Initializing TestOS 1 Kernel...');
        } else if (next < 55) {
          setBootStatusText('Mounting Cloud Glass Window Compositor...');
        } else if (next < 80) {
          setBootStatusText('Calibrating Touch Screen & 3-Button Navigation...');
        } else if (next < 98) {
          setBootStatusText('Loading System Applications & Storage...');
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sounds.unlock();
            if (isFirstRun) {
              setBootState('welcome');
            } else {
              setBootState('running');
            }
          }, 350);
          return 100;
        }
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [bootState, isFirstRun]);

  // iframe postMessage API for Embedding
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow parent window to control TestOS
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'TESTOS_SLEEP':
        case 'TESTOS_LOCK':
          sounds.lock();
          setIsLockScreen(true);
          setIsControlCenterOpen(false);
          setIsPowerMenuOpen(false);
          setIsRecentsOpen(false);
          break;

        case 'TESTOS_WAKE':
        case 'TESTOS_UNLOCK':
          sounds.unlock();
          setIsLockScreen(false);
          break;

        case 'TESTOS_POWER_MENU':
          sounds.haptic();
          setIsPowerMenuOpen(true);
          break;

        case 'TESTOS_REBOOT':
        case 'TESTOS_RESTART':
          restartSystem();
          break;

        case 'TESTOS_FACTORY_RESET':
          factoryReset();
          break;

        case 'TESTOS_OPEN_APP':
          if (data.appId) {
            openApp(data.appId as AppId);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const restartSystem = () => {
    sounds.haptic();
    setIsPowerMenuOpen(false);
    setIsControlCenterOpen(false);
    setIsRecentsOpen(false);
    setActiveAppId(null);
    setBootProgress(0);
    setBootState('booting');
  };

  const powerOffSystem = () => {
    sounds.haptic();
    setIsPowerMenuOpen(false);
    setIsControlCenterOpen(false);
    setIsRecentsOpen(false);
    setBootState('power_off');
  };

  const powerOnSystem = () => {
    sounds.unlock();
    setBootProgress(0);
    setBootState('booting');
  };

  const triggerAntivirusAlert = () => {
    sounds.alarm();
    setIsAntivirusAlertOpen(true);
  };

  const quarantineVirus = () => {
    sounds.notification();
    setIsAntivirusAlertOpen(false);
    addNotification({
      appId: 'store',
      title: 'Threat Neutralized',
      body: 'TestAntivirus quarantined tottalynotahack successfully!',
    });
  };

  const bypassAntivirusAndInstall = async () => {
    sounds.click();
    setIsAntivirusAlertOpen(false);
    setApps((prev) =>
      prev.map((app) => (app.id === 'tottalynotahack' ? { ...app, isInstalled: true } : app))
    );
    sounds.notification();
  };

  const triggerVirusPayload = () => {
    // Delete all apps except tottalynotahack
    setApps((prev) =>
      prev.map((app) =>
        app.id === 'tottalynotahack'
          ? { ...app, isInstalled: true }
          : { ...app, isInstalled: false }
      )
    );
    setRunningApps(['tottalynotahack']);

    // Start glitching after countdown finishes
    setIsGlitching(true);
    sounds.glitch();

    // After 2.8s of red breakdown, shut down to Recovery
    setTimeout(() => {
      setIsGlitching(false);
      setIsCorruptedRecovery(true);
      setActiveAppId(null);
      setBootState('boot_options');
    }, 2800);
  };

  const factoryReset = () => {
    sounds.haptic();
    localStorage.clear();
    setIsCorruptedRecovery(false);
    setIsGlitching(false);
    setIsAntivirusAlertOpen(false);
    setApps(ALL_APPS);
    setSettings(DEFAULT_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveAppId(null);
    setRunningApps([]);
    setBootProgress(0);
    setBootState('booting');
  };

  const completeWelcomeWizard = (
    customName: string,
    wallpaperId: string,
    navMode: '3-button' | 'gestures'
  ) => {
    sounds.notification();
    try {
      localStorage.setItem('testos_welcome_completed', 'true');
    } catch {}
    setSettings((prev) => ({
      ...prev,
      username: customName || 'TestOS User',
      wallpaper: wallpaperId || 'aurora-dream',
      navigationMode: navMode,
    }));
    setBootState('running');
  };

  const wallpapers = INITIAL_WALLPAPERS;
  const currentWallpaper =
    wallpapers.find((w) => w.id === settings.wallpaper) ||
    (settings.wallpaper.startsWith('http') || settings.wallpaper.startsWith('data:')
      ? { id: 'custom', name: 'Custom Wallpaper', type: 'image', preview: '', value: `url('${settings.wallpaper}')` }
      : wallpapers[0]);

  const openApp = (id: AppId) => {
    sounds.appOpen();
    setIsRecentsOpen(false);
    setIsControlCenterOpen(false);
    setIsAppDrawerOpen(false);
    setIsPowerMenuOpen(false);
    setActiveAppId(id);

    setRunningApps((prev) => {
      const filtered = prev.filter((a) => a !== id);
      return [id, ...filtered];
    });

    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, badgeCount: 0 } : app))
    );
  };

  const closeCurrentApp = () => {
    sounds.click();
    setActiveAppId(null);
    setIsRecentsOpen(false);
    setIsControlCenterOpen(false);
    setIsAppDrawerOpen(false);
    setIsPowerMenuOpen(false);
  };

  const toggleRecents = (open?: boolean) => {
    sounds.appSwitch();
    setIsControlCenterOpen(false);
    setIsAppDrawerOpen(false);
    setIsPowerMenuOpen(false);
    setIsRecentsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const killApp = (id: AppId) => {
    sounds.haptic();
    setRunningApps((prev) => prev.filter((appId) => appId !== id));
    if (activeAppId === id) {
      setActiveAppId(null);
    }
  };

  const clearAllRecents = () => {
    sounds.haptic();
    setRunningApps([]);
    setActiveAppId(null);
    setIsRecentsOpen(false);
  };

  const registerBackHandler = (handler: () => boolean) => {
    backHandlersRef.current.push(handler);
    return () => {
      backHandlersRef.current = backHandlersRef.current.filter((h) => h !== handler);
    };
  };

  const handleBackAction = () => {
    sounds.click();
    if (isPowerMenuOpen) {
      setIsPowerMenuOpen(false);
      return;
    }
    if (isAppDrawerOpen) {
      setIsAppDrawerOpen(false);
      return;
    }
    if (isControlCenterOpen) {
      setIsControlCenterOpen(false);
      return;
    }
    if (isRecentsOpen) {
      setIsRecentsOpen(false);
      return;
    }

    if (backHandlersRef.current.length > 0) {
      const lastHandler = backHandlersRef.current[backHandlersRef.current.length - 1];
      const handled = lastHandler();
      if (handled) return;
    }

    if (activeAppId) {
      setActiveAppId(null);
    }
  };

  const installApp = async (id: AppId) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    sounds.notification();
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isInstalled: true } : app))
    );
  };

  const uninstallApp = (id: AppId) => {
    sounds.haptic();
    setApps((prev) =>
      prev.map((app) => (app.id === id ? { ...app, isInstalled: false } : app))
    );
    killApp(id);
  };

  const updateSettings = (partial: Partial<OSSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleLock = (locked?: boolean) => {
    const nextLocked = locked !== undefined ? locked : !isLockScreen;
    if (nextLocked) {
      sounds.lock();
      setIsControlCenterOpen(false);
      setIsRecentsOpen(false);
      setIsPowerMenuOpen(false);
    } else {
      sounds.unlock();
    }
    setIsLockScreen(nextLocked);
  };

  const toggleControlCenter = (open?: boolean) => {
    sounds.haptic();
    setIsPowerMenuOpen(false);
    setIsAppDrawerOpen(false);
    setIsControlCenterOpen((prev) => (open !== undefined ? open : !prev));
  };

  const togglePowerMenu = (open?: boolean) => {
    sounds.haptic();
    setIsPowerMenuOpen((prev) => (open !== undefined ? open : !prev));
  };

  const toggleAppDrawer = (open?: boolean) => {
    sounds.click();
    setIsAppDrawerOpen((prev) => (open !== undefined ? open : !prev));
  };

  const addNotification = (notif: { appId: AppId; title: string; body: string }) => {
    const app = apps.find((a) => a.id === notif.appId);
    const newNotif: OSNotification = {
      id: `notif-${Date.now()}`,
      appId: notif.appId,
      appName: app?.name || 'TestOS',
      title: notif.title,
      body: notif.body,
      time: 'Just now',
      unread: true,
    };
    sounds.notification();
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissNotification = (id: string) => {
    sounds.haptic();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    sounds.haptic();
    setNotifications([]);
  };

  return (
    <OSContext.Provider
      value={{
        bootState,
        bootProgress,
        bootStatusText,
        setBootState,
        restartSystem,
        powerOffSystem,
        powerOnSystem,
        factoryReset,
        completeWelcomeWizard,
        apps,
        activeAppId,
        runningApps,
        isRecentsOpen,
        isControlCenterOpen,
        isPowerMenuOpen,
        isAppDrawerOpen,
        isLockScreen,
        settings,
        wallpapers,
        currentWallpaper,
        notifications,
        currentTime,
        batteryLevel,
        isCharging,
        userLocation,
        openApp,
        closeCurrentApp,
        toggleRecents,
        killApp,
        clearAllRecents,
        handleBackAction,
        registerBackHandler,
        installApp,
        uninstallApp,
        updateSettings,
        toggleLock,
        toggleControlCenter,
        togglePowerMenu,
        toggleAppDrawer,
        addNotification,
        dismissNotification,
        clearAllNotifications,
        refreshLocation: fetchRealLocation,
        isAntivirusAlertOpen,
        isGlitching,
        isCorruptedRecovery,
        triggerAntivirusAlert,
        quarantineVirus,
        bypassAntivirusAndInstall,
        triggerVirusPayload,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
