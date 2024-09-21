"use client";
import React, { useState } from "react";
import { Search, Home, Bell, Calendar, Loader2, LogOut } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { LoginUI } from "@/components/loginUI";
import { useWalletContext } from "@/privy/walletContext";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { switchNetworkFunction } from "@/utils/chainUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MainDocLayout = ({ children, path = [] }) => {
  const { signer, w0, address, isLoading, error } = useWalletContext();
  const [isHovered, setIsHovered] = useState(false);
  const getShortAddress = (address) => {
    if (address.length > 10) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address;
  };
  const { ready, authenticated, logout } = usePrivy();
  const router = useRouter();
  if (!ready)
    return (
      <div className="h-screen grid place-items-center">
        <div className="animate-spin text-yellow-400">
          <Loader2 />
        </div>
      </div>
    );
  const switchNetwork = async () => {
    await switchNetworkFunction(
      w0,
      w0.chainId === "eip155:11155420" ? "HELIUM_FHENIX" : "OP_SEPOLIA"
    );
  };

  const logoutUser = async () => {
    logout();
    await router.replace("/");
  };

  console.log(w0?.chainId);

  if (!authenticated) {
    return (
      <div className="h-screen grid place-items-center">
        <LoginUI />
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      {/* <Button onClick = {switchNetwork}>Switch network</Button> */}
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r  flex flex-col items-center py-4">
        <Link href={"/"}>
          <img
            src="/logo.png"
            className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mb-8"
          />
        </Link>

        <span className="text-white font-bold text-xl">8</span>
        <nav className="flex-1 flex flex-col items-center space-y-6">
          {/* <Search className="text-gray-400 cursor-pointer" size={16} /> */}
          {/* <Home className="text-black cursor-pointer" size={16} /> */}
          {/* <Home className="text-gray-400 cursor-pointer" size={16} /> */}
          {/* <Bell className="text-gray-400 cursor-pointer" size={16} /> */}
          {/* <Calendar className="text-gray-400 cursor-pointer" size={16} /> */}
        </nav>
        <div className="mt-auto w-6 h-6 bg-yellow-100 rounded-full" />
        <div className="mt-4 w-8 h-4 bg-yellow-100 rounded-full" />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b">
          <div className="flex items-center justify-between px-6 pr-12 py-6">
            <div className="flex items-center space-x-4">
              <Breadcrumb items={path} />
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="max-h-full flex items-center bg-white p-1.5 px-2.5 border rounded-lg cursor-pointer w-[8.5rem]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={isHovered ? logoutUser : undefined}
              >
                {isHovered || address === null || !address ? (
                  <div className="flex items-center text-red-500 h-8">
                    <LogOut size={16} className="mr-3" />
                    <span className="text-sm font-medium">Logout</span>
                  </div>
                ) : (
                  <div className="h-8 flex items-center">
                    <img
                      src="/profile.jpg"
                      alt="Dr. Arma"
                      className="w-8 h-8 rounded-full border mr-3"
                    />
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-800">
                        Doctor
                      </div>
                      <div className="text-xs text-gray-600">
                        {getShortAddress(address)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default MainDocLayout;

const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span
            className={
              index === items.length - 1 ? "text-black" : "text-gray-500"
            }
          >
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="text-gray-500 mx-1">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
