"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "./config";
import WalletProvider from "./walletContext";

const PrivyWrapper = ({ children }) => {
  return (
    <PrivyProvider {...privyConfig}>
      <WalletProvider>{children}</WalletProvider>
    </PrivyProvider>
  );
};

export default PrivyWrapper;
