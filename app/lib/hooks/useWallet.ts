// app/lib/hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
    account: string | null;
    provider: ethers.providers.Web3Provider | null;
    isConnecting: boolean;
    error: string | null;
}

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        account: null,
        provider: null,
        isConnecting: false,
        error: null
    });

    useEffect(() => {
        const initWallet = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    setState(prev => ({ ...prev, provider }));

                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        setState(prev => ({ ...prev, account: accounts[0] }));
                    }

                    const handleAccountsChanged = (accounts: string[]) => {
                        setState(prev => ({
                            ...prev,
                            account: accounts.length > 0 ? accounts[0] : null
                        }));
                    };

                    window.ethereum.on('accountsChanged', handleAccountsChanged);

                    return () => {
                        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                    };
                } catch (error) {
                    setState(prev => ({
                        ...prev,
                        error: 'Failed to initialize wallet'
                    }));
                }
            } else {
                setState(prev => ({
                    ...prev,
                    error: 'Please install MetaMask'
                }));
            }
        };

        initWallet();
    }, []);

    const connectWallet = async () => {
        if (!state.provider) return;
        
        setState(prev => ({ ...prev, isConnecting: true, error: null }));
        
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            setState(prev => ({
                ...prev,
                account: accounts[0],
                isConnecting: false
            }));
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                error: error.message || 'Failed to connect wallet',
                isConnecting: false
            }));
        }
    };

    return {
        ...state,
        connectWallet
    };
}