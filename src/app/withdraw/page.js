"use client";
import React, { useEffect, useState } from "react";
import { Header } from "../page";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/utils/webHelpers";
import {
  PAYROLLABI,
  PAYROLLCONTRACTADDRESS,
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
} from "@/utils/contractAddress";
import { Contract, ethers } from "ethers";
import Image from "next/image";
import { motion } from "framer-motion";

const Withdraw = ({ smartContractAccountAddress, signer, smartAccount }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user: authenticated,
    handleLogOut,
  } = useDynamicContext();
  const [amount, setAmount] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  const address = w0?.address;

  useEffect(() => {
    if (ready && authenticated && w0) {
      // w0.switchChain(9090);
      // fundWallet();
    }
  }, [ready, authenticated, w0]);
  const withdrawFunds = async () => {
    setIsWithdrawing(true);
    try {
      const tokenBridgeContract = await new Contract(
        TOKENBRIDGECONTRACTADDRESS,
        TOKENBRIDGEABI,
        signer
      );

      const txData = await tokenBridgeContract.withdrawFunds(
        ethers.utils.parseEther(amount),
        {
          gasLimit: 7920027,
        }
      );

      console.log("Withdrawal successful");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="mt-4">
      <Header
        authenticated={authenticated}
        smartAccountAddress={address}
        address={address}
      />

      <motion.section
        className="py-20 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Withdraw funds securely.
          </motion.h1>
          <motion.p
            className="text-lg text-foreground/60 mb-10"
            variants={itemVariants}
          >
            We ensure that every withdrawal is both secure and discreet,
            <br />
            allowing you to manage your finances with complete privacy.
          </motion.p>
          <motion.div variants={itemVariants}>
            <InputFieldsWithIcons
              amount={amount}
              setAmount={setAmount}
              address={smartContractAccountAddress}
              setAddress={setInputAddress}
            />
            <motion.div
              whileHover={!isWithdrawing ? { scale: 1.05 } : {}}
              whileTap={!isWithdrawing ? { scale: 0.95 } : {}}
            >
              <Button
                className={`w-full mt-4 px-6 py-3 rounded-md font-medium transition-colors ${
                  isWithdrawing
                    ? "bg-[#F3BA2F]/50 cursor-not-allowed"
                    : "bg-[#F3BA2F] hover:bg-[#F3BA2F]/70 active:bg-[#F3BA2F]/50 cursor-pointer"
                }`}
                onClick={withdrawFunds}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <span className="flex items-center justify-center text-black">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0B0E11]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Withdrawing...
                  </span>
                ) : (
                  <p className="text-black">Withdraw</p>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Withdraw;

import { DollarSign, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const InputFieldsWithIcons = ({ amount, setAmount, address, setAddress }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Amount to withdraw"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-400"
        />
        <DollarSign
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Withdrawal address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-400"
        />
        <Wallet
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>
    </div>
  );
};
