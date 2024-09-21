"use client";
import { LoginUI } from "@/components/loginUI";
import { useWalletContext } from "@/privy/walletContext";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { signer, w0, address, isLoading, error } = useWalletContext();
  const { authenticated, ready } = usePrivy();

  if (ready && !authenticated)
    return (
      <div className="h-screen grid place-items-center">
        <LoginUI />
      </div>
    );

  return (
    <div className="h-screen grid place-items-center">
      <div className="animate-spin text-yellow-400">
        <Loader2 />
      </div>
    </div>
  );
};

export default Page;
