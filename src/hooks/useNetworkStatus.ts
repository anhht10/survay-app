import { useState, useEffect } from 'react';
import { networkDetector } from '../services/sync/networkDetector';
import { syncManager } from '../services/sync/syncManager';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(networkDetector.isOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(syncManager.getIsSyncing());
  const [syncMessage, setSyncMessage] = useState<string | undefined>();

  useEffect(() => {
    const unsubNetwork = networkDetector.subscribe((online) => {
      setIsOnline(online);
    });

    const unsubSync = syncManager.subscribe((syncing, msg) => {
      setIsSyncing(syncing);
      setSyncMessage(msg);
    });

    return () => {
      unsubNetwork();
      unsubSync();
    };
  }, []);

  return {
    isOnline,
    isSyncing,
    syncMessage
  };
}

