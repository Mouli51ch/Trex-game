'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { GameContractManager } from '@/app/lib/contractUtils';

interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  gameContract: GameContractManager | null;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  chainId: number | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  gameContract: null,
  isLoading: true,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  chainId: null,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [gameContract, setGameContract] = useState<GameContractManager | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setGameContract(null);
    setChainId(null);
    setError(null);
  }, []);

  const initializeContract = useCallback(async (provider: ethers.providers.Web3Provider, address: string) => {
    try {
      const contract = new GameContractManager(provider);
      await contract.initialize(address);
      setGameContract(contract);
    } catch (err) {
      console.error("Failed to initialize contract:", err);
      setError("Failed to initialize game contract");
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Get network
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);

        // Check if already connected
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await initializeContract(web3Provider, accounts[0]);
        }
      } else {
        setError('Please install MetaMask');
      }
    } catch (err) {
      console.error('Web3 initialization error:', err);
      setError('Failed to initialize Web3');
    } finally {
      setIsLoading(false);
    }
  }, [initializeContract]);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider) {
        throw new Error('No provider available');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);
      await initializeContract(provider, accounts[0]);
      
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      if (!gameContract && provider) {
        initializeContract(provider, accounts[0]);
      }
    } else {
      disconnectWallet();
    }
  }, [gameContract, provider, initializeContract, disconnectWallet]);

  // Handle chain changes
  const handleChainChanged = useCallback((newChainId: string) => {
    setChainId(parseInt(newChainId));
    // Reinitialize on chain change
    initialize();
  }, [initialize]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Setup event listeners
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        gameContract,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        chainId,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};