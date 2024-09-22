"use client";
import React, { useEffect, useState } from "react";
import { Header } from "../page";
import { Button } from "@/components/ui/button";
import { getInstance } from "@/utils/fhevm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import axios from "axios";
import {
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
} from "@/utils/contractAddress";
import { Contract, ethers } from "ethers";
import { motion } from "framer-motion";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import axios from "axios";

const Pay = ({ smartContractAccountAddress, signer, smartAccount }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user,
    handleLogOut,
  } = useDynamicContext();
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [tokens, setTokens] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    amount: "",
    address1: "0x0C2E8090a89A0af92a54420F29FC8ABE5FB3C2cb",
    amount1: "300",
    address2: "0x75d86ABf381f10276d212a27140A36F6720A0D1a",
    amount2: "300",
    address3: "0xee559E753aCF8cE65Bf56e595A9A83F1E648016C",
    amount3: "300",
    locktime: "",
    dilute: "",
  });

  const formFields = [
    { id: "address1", label: "Address 1" },
    { id: "amount1", label: "Amount 1" },
    { id: "address2", label: "Address 2" },
    { id: "amount2", label: "Amount 2" },
    { id: "address3", label: "Address 3" },
    { id: "amount3", label: "Amount 3" },
    { id: "locktime", label: "Lock Time" },
    { id: "dilute", label: "Dilute" },
  ];

  const getFhevmInstance = async () => {
    const instance = await getInstance();
    setFhevmInstance(instance);
  };

  useEffect(() => {
    getFhevmInstance();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const address = smartContractAccountAddress;
  console.log(w0?.chainId);
  const handleFormSubmit = async () => {
    setIsLoading(true);
    console.log(formValues);
    const {
      amount,
      address1,
      amount1,
      address2,
      amount2,
      address3,
      amount3,
      locktime,
      dilute,
    } = formValues;

    const addressArray = [address1, address2, address3];

    const encryptedAmount = await fhevmInstance.encrypt32(Number(amount1));
    // Using ethers.js AbiCoder to encode the encrypted value

    const bytesFor1 = ethers.utils.defaultAbiCoder.encode(
      ["bytes"],
      [encryptedAmount]
    );

    // Padding the encoded bytes to get the desired substring
    let paddedBytesFor1 = "0x" + bytesFor1.slice(130, 33146);
    console.log({
      user: smartContractAccountAddress,
      userAddress1: address1,
      userAddresses2: address2,
      userAddresses3: address3,
      encryptedData: paddedBytesFor1,
    });
    // user, userAddress1, userAddresses2, userAddresses3, encryptedData

    const tokenBridgeContract = await new Contract(
      TOKENBRIDGECONTRACTADDRESS,
      TOKENBRIDGEABI,
      signer
    );

    console.log(addressArray);

    try {
      const txData = tokenBridgeContract.distributeFunds(
        address1,
        address2,
        address3,
        await fhevmInstance.encrypt32(Number(amount1))
      );
    } catch (error) {
      console.log(error);
    }

    // await userOpResponse.wait(1);

    try {
      const { data } = await axios.post(
        "http://13.201.185.94:3000/distribute-funds",
        {
          amount1: Number(amount1),
          user: smartContractAccountAddress,
          userAddress1: address1,
          userAddresses2: address2,
          userAddresses3: address3,
          encryptedData: ["svsd"],
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };

  const handleRefreshToken = async () => {
    await w0.switchChain(9090);
  };
  return (
    <div className="mt-4">
      <Header
        address={address}
        authenticated={user}
        smartAccountAddress={w0?.address}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-8 pt-8"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center"
        >
          We make transactions{" "}
          <span className="text-[#FCD535]">confidential</span> and{" "}
          <span className="text-[#FCD535]">easy.</span>
        </motion.h1>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center text-foreground/70 mb-12"
        >
          We ensure that every transaction is both secure and discreet, allowing
          you to manage your finances with complete privacy.
        </motion.p>
      </motion.div>
      <div className="space-y-8 mt-4 flex flex-col items-center justify-center">
        <div className="">
          <p className="font-semibold text-xl w-full flex md:hidden md:text-3xl md:mt-12 md:mb-8">
            Distribution per address.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 max-w-3xl w-full">
          {formFields.map(({ id, label }, index) => (
            <motion.div
              key={id}
              variants={formFieldVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              className={`grid gap-2 md:grid-cols-2 items-center`}
            >
              <Label htmlFor={id} className="md:text-lg md:font-semibold">
                {label}
              </Label>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Input
                  type={`${
                    id === "locktime" || id === "dilute" ? "date" : "text"
                  }`}
                  id={id}
                  className="placeholder:text-black text-black"
                  onChange={handleChange}
                  value={formValues[id]}
                  placeholder={label}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-end w-full max-w-3xl">
          <motion.button
            onClick={handleFormSubmit}
            disabled={isLoading}
            className={`py-2.5 px-4 text-center rounded-lg duration-150 text-[#0B0E11] ${
              isLoading
                ? "bg-[#F3BA2F]/50 cursor-not-allowed"
                : "bg-[#F3BA2F] hover:bg-[#F3BA2F]/70 active:bg-[#F3BA2F]/50 cursor-pointer"
            }`}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center">
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
                Processing...
              </span>
            ) : (
              "Submit"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
