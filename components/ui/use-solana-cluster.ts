/**
 * Hook para manejar clusters de Solana
 *
 * Funcionalidades:
 * - Soporte para mainnet-beta, testnet, devnet
 * - Cambio de cluster
 * - Información del cluster actual
 * - Endpoints por cluster
 */

import { useState, useEffect, useCallback } from "react";

export type SolanaCluster = "mainnet-beta" | "testnet" | "devnet";

interface ClusterInfo {
  name: string;
  displayName: string;
  color: string;
  description: string;
  endpoints: string[];
}

export function useSolanaCluster() {
  const [currentCluster, setCurrentCluster] = useState<SolanaCluster>("devnet");
  const [currentEndpoint, setCurrentEndpoint] = useState<string>(
    "https://api.devnet.solana.com",
  );

  // Cluster configuration
  const clusterConfig: Record<SolanaCluster, ClusterInfo> = {
    "mainnet-beta": {
      name: "mainnet-beta",
      displayName: "Mainnet",
      color: "green",
      description: "Production network with real SOL",
      endpoints: [
        "https://api.mainnet-beta.solana.com",
        "https://rpc.ankr.com/solana",
        "https://solana-api.projectserum.com",
      ],
    },
    testnet: {
      name: "testnet",
      displayName: "Testnet",
      color: "blue",
      description: "Testing network with test SOL",
      endpoints: [
        "https://api.testnet.solana.com",
        "https://testnet.helius-rpc.com/?api-key=demo",
      ],
    },
    devnet: {
      name: "devnet",
      displayName: "Devnet",
      color: "purple",
      description: "Development network with free SOL",
      endpoints: [
        "https://api.devnet.solana.com",
        "https://devnet.helius-rpc.com/?api-key=demo",
      ],
    },
  };

  // Update endpoint when cluster changes
  useEffect(() => {
    const config = clusterConfig[currentCluster];
    const primaryEndpoint = config.endpoints[0];

    console.log(
      `🔗 Setting Solana endpoint for ${currentCluster}:`,
      primaryEndpoint,
    );
    setCurrentEndpoint(primaryEndpoint);
  }, [currentCluster]);

  // Switch cluster
  const switchCluster = useCallback((cluster: SolanaCluster) => {
    console.log(`🔄 Switching to ${cluster} cluster`);
    setCurrentCluster(cluster);
  }, []);

  // Get current cluster info
  const getCurrentClusterInfo = useCallback(() => {
    return clusterConfig[currentCluster];
  }, [currentCluster]);

  // Get all available clusters
  const getAvailableClusters = useCallback(() => {
    return Object.values(clusterConfig);
  }, []);

  // Test endpoint connectivity
  const testEndpoint = useCallback(
    async (endpoint: string): Promise<boolean> => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getHealth",
          }),
        });

        return response.ok;
      } catch (error) {
        console.warn(`❌ Endpoint ${endpoint} failed:`, error);
        return false;
      }
    },
    [],
  );

  // Test all endpoints for current cluster
  const testCurrentClusterEndpoints = useCallback(async () => {
    const config = clusterConfig[currentCluster];
    const results = await Promise.all(
      config.endpoints.map((endpoint) => testEndpoint(endpoint)),
    );

    return config.endpoints.map((endpoint, index) => ({
      endpoint,
      working: results[index],
    }));
  }, [currentCluster, testEndpoint]);

  return {
    currentCluster,
    currentEndpoint,
    clusterConfig,
    switchCluster,
    getCurrentClusterInfo,
    getAvailableClusters,
    testEndpoint,
    testCurrentClusterEndpoints,
  };
}
