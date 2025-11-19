import { useState, useCallback } from 'react';

export type VapiCallStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected'
  | 'error';

export const useMockVapi = () => {
  const [status, setStatus] = useState<VapiCallStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const startCall = useCallback(async () => {
    try {
      setStatus('connecting');
      setError(null);

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setStatus('connected');

      // Auto-end call after 10 seconds for demo
      setTimeout(() => {
        if (status === 'connected') {
          setStatus('disconnecting');
          setTimeout(() => setStatus('disconnected'), 500);
        }
      }, 10000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to start voice call');
    }
  }, [status]);

  const stopCall = useCallback(() => {
    setStatus('disconnecting');
    setTimeout(() => setStatus('disconnected'), 500);
  }, []);

  return {
    status,
    error,
    startCall,
    stopCall,
    isCallActive: status === 'connected' || status === 'connecting',
    isConnecting: status === 'connecting',
  };
};
