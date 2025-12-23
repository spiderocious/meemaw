import { ReactNode, useEffect, useState, useRef } from 'react';

export type PersistenceType = 'local' | 'session' | 'memory';

export interface ShowOnceProps {
  for?: number;
  persist?: boolean;
  persistKey?: string;
  persistType?: PersistenceType;
  children: ReactNode;
}

const STORAGE_PREFIX = 'meemaw_showonce_';

function generateKey(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getStorage(type: PersistenceType): Storage | null {
  if (typeof window === 'undefined') return null;

  switch (type) {
    case 'local':
      return localStorage;
    case 'session':
      return sessionStorage;
    default:
      return null;
  }
}

const memoryStore = new Map<string, boolean>();

function hasBeenShown(key: string, persistType: PersistenceType): boolean {
  if (persistType === 'memory') {
    return memoryStore.has(key);
  }

  const storage = getStorage(persistType);
  if (!storage) return false;

  return storage.getItem(`${STORAGE_PREFIX}${key}`) === 'true';
}

function markAsShown(key: string, persistType: PersistenceType): void {
  if (persistType === 'memory') {
    memoryStore.set(key, true);
    return;
  }

  const storage = getStorage(persistType);
  if (storage) {
    storage.setItem(`${STORAGE_PREFIX}${key}`, 'true');
  }
}

export function ShowOnce({
  for: duration,
  persist = false,
  persistKey,
  persistType = 'local',
  children,
}: ShowOnceProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(true);
  const keyRef = useRef<string>(persistKey || generateKey());
  const hasCheckedPersistence = useRef(false);

  useEffect(() => {
    // Check if already shown (only once)
    if (persist && !hasCheckedPersistence.current) {
      hasCheckedPersistence.current = true;
      const wasShown = hasBeenShown(keyRef.current, persistType);
      if (wasShown) {
        setIsVisible(false);
        return undefined;
      }
    }

    // Set up duration-based hiding
    if (duration !== undefined && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (persist) {
          markAsShown(keyRef.current, persistType);
        }
      }, duration);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [duration, persist, persistType]);

  // Mark as shown when component unmounts (if persist is enabled and no duration)
  useEffect(() => {
    return () => {
      if (persist && duration === undefined) {
        markAsShown(keyRef.current, persistType);
      }
    };
  }, [persist, duration, persistType]);

  return isVisible ? <>{children}</> : null;
}
