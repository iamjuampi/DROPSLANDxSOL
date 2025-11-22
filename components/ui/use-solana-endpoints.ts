/**
 * Hook para manejar múltiples endpoints de Solana
 * 
 * Funcionalidades:
 * - Lista de endpoints confiables
 * - Fallback automático
 * - Detección de endpoints bloqueados
 * - Selección automática del mejor endpoint
 */

import { useState, useEffect, useCallback } from 'react';
import { Connection } from '@solana/web3.js';

interface EndpointStatus {
  url: string;
  working: boolean;
  latency: number;
  lastChecked: Date;
}

export function useSolanaEndpoints() {
  const [endpoints] = useState<string[]>([
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com', 
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.alchemy.com/v2/demo',
    'https://rpc.helius.xyz/?api-key=demo',
    'https://mainnet.helius-rpc.com/?api-key=demo'
  ]);

  const [currentEndpoint, setCurrentEndpoint] = useState<string>(endpoints[0]);
  const [endpointStatuses, setEndpointStatuses] = useState<EndpointStatus[]>([]);
  const [testing, setTesting] = useState(false);

  // Test endpoint connectivity
  const testEndpoint = useCallback(async (url: string): Promise<EndpointStatus> => {
    const startTime = Date.now();
    try {
      const connection = new Connection(url, 'confirmed');
      await connection.getSlot();
      const latency = Date.now() - startTime;
      
      return {
        url,
        working: true,
        latency,
        lastChecked: new Date()
      };
    } catch (error) {
      console.warn(`❌ Endpoint ${url} failed:`, error);
      return {
        url,
        working: false,
        latency: 9999,
        lastChecked: new Date()
      };
    }
  }, []);

  // Test all endpoints and find the best one
  const findBestEndpoint = useCallback(async () => {
    setTesting(true);
    console.log('🔍 Testing Solana endpoints...');
    
    const results = await Promise.all(
      endpoints.map(endpoint => testEndpoint(endpoint))
    );
    
    setEndpointStatuses(results);
    
    // Find the best working endpoint (lowest latency)
    const workingEndpoints = results.filter(status => status.working);
    if (workingEndpoints.length > 0) {
      const bestEndpoint = workingEndpoints.reduce((best, current) => 
        current.latency < best.latency ? current : best
      );
      
      console.log('✅ Best endpoint found:', bestEndpoint.url, `(${bestEndpoint.latency}ms)`);
      setCurrentEndpoint(bestEndpoint.url);
    } else {
      console.error('❌ No working endpoints found');
    }
    
    setTesting(false);
  }, [endpoints, testEndpoint]);

  // Auto-test endpoints on mount
  useEffect(() => {
    findBestEndpoint();
  }, [findBestEndpoint]);

  return {
    currentEndpoint,
    endpoints,
    endpointStatuses,
    testing,
    findBestEndpoint,
    testEndpoint
  };
}




