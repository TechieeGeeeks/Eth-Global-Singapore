"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";

const WalletContext = createContext(null);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { wallets } = useWallets();
  const [walletDetails, setWalletDetails] = useState({
    signer: null,
    w0: null,
    address: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initializeWallet = async () => {
      if (wallets.length > 0) {
        const w0 = wallets[0];
        try {
          const provider = await w0.getEthersProvider();
          const signer = await provider.getSigner();
          const address = w0.address;

          setWalletDetails({
            signer,
            w0,
            address,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error initializing wallet:", error);
          setWalletDetails((prev) => ({
            ...prev,
            isLoading: false,
            error: "Failed to initialize wallet",
          }));
        }
      } else {
        setWalletDetails((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeWallet();
  }, [wallets]);

  return (
    <WalletContext.Provider value={walletDetails}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
