import { useEffect, useState } from 'react';
import {
  connectGameToHost,
  type GuestBridgeConnection,
  type HostApiV1,
  type HostSnapshotV1,
} from '../sdk/guest';

type SnapshotListener = (snapshot: HostSnapshotV1 | null) => void;

type HostBridge = {
  connection: GuestBridgeConnection;
  listeners: Set<SnapshotListener>;
  latest: HostSnapshotV1 | null;
};

let bridge: HostBridge | undefined;

function getHostBridge(): HostBridge | null {
  if (typeof window === 'undefined') return null;
  // Check if we are inside an iframe
  const inIframe = window.self !== window.top;
  if (!inIframe) {
    return null; // Standalone mode
  }

  if (bridge) return bridge;
  const listeners = new Set<SnapshotListener>();
  const created: HostBridge = {
    listeners,
    latest: null,
    connection: connectGameToHost({
      async setState(snapshot) {
        created.latest = snapshot;
        listeners.forEach(listener => listener(snapshot));
      },
    }),
  };
  bridge = created;
  return created;
}

export function useCasinoHost(): {
  hostApi: HostApiV1 | null;
  snapshot: HostSnapshotV1 | null;
  isStandalone: boolean;
} {
  const [hostApi, setHostApi] = useState<HostApiV1 | null>(null);
  const [snapshot, setSnapshot] = useState<HostSnapshotV1 | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const host = getHostBridge();
    if (!host) {
      setIsStandalone(true);
      return;
    }

    let mounted = true;
    host.listeners.add(setSnapshot);
    setSnapshot(host.latest);

    const timeout = setTimeout(() => {
      // If after 1.5 seconds the host handshake didn't resolve, allow standalone fallback
      if (mounted && !hostApi) {
        setIsStandalone(true);
      }
    }, 1500);

    void host.connection.promise
      .then(parent => {
        if (mounted) {
          setHostApi(parent);
          setIsStandalone(false);
          clearTimeout(timeout);
        }
      })
      .catch(() => {
        if (mounted) setIsStandalone(true);
      });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      host.listeners.delete(setSnapshot);
    };
  }, [hostApi]);

  return { hostApi, snapshot, isStandalone };
}
