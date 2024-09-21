"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { truncateAddress } from "@/utils/webHelpers";
import clsx from "clsx";
import {
  BanknoteIcon,
  ChevronDown,
  CoinsIcon,
  CopyIcon,
  DollarSign,
  LogOutIcon,
  PiggyBank,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { getInstance } from "@/utils/fhevm";
import {
  PAYROLLCONTRACTADDRESS,
  TOKENBRIDGEABI,
  TOKENBRIDGECONTRACTADDRESS,
  USDCABI,
  USDCCONTRACTADDRESS,
} from "@/utils/contractAddress";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import Pay from "./pay/page.js";
import Withdraw from "./withdraw/page";
import LandingPage from "@/components/landingPage";
import { setNavigation } from "@/redux/slices/navigationSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";

const Page = () => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user,
    handleLogOut,
  } = useDynamicContext();
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const getSigner = async () => {
      const signer = await w0?._connector?.ethers?.getSigner();
      console.log(signer);
      setSigner(signer);
    };
    getSigner();
  }, [w0]);

  console.log(w0?._connector?.ethers?.getSigner());
  // const provider = await w0?.getEthersProvider();
  // const signer = await provider?.getSigner();
  console.log(user);

  const { navigation } = useSelector((state) => state.navigation);
  // console.log(navigation);
  // const { authenticated } = usePrivy();
  const dispatch = useDispatch();

  return (
    <>
      {(navigation === "/login" || navigation === null) && (
        <>
          <div className="pt-4">
            <Header
              address={w0?.address}
              authenticated={user}
              signer={signer}
            />
          </div>

          <LandingPage />
        </>
      )}
      {navigation === "/" && (
        <>
          <div className="pt-4">
            <Header
              address={w0?.address}
              authenticated={user}
              smartAccountAddress={w0?.address}
            />
          </div>

          <LandingPage />
        </>
      )}
      {navigation === "/deposit" && (
        <Home signer={signer} smartContractAccountAddress={w0?.address} />
      )}
      {navigation === "/pay" && (
        <Pay signer={signer} smartContractAccountAddress={w0?.address} />
      )}
      {navigation === "/withdraw" && (
        <Withdraw signer={signer} smartContractAccountAddress={w0?.address} />
      )}
    </>
  );
};

export default Page;

const Home = ({ signer, smartContractAccountAddress }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user: authenticated,
    handleLogOut: logout,
  } = useDynamicContext();
  const [fhevmInstance, setFhevmInstance] = useState(null);
  const [activeTab, setActiveTab] = useState("deposit");
  const dispatch = useDispatch();
  const [tokens, setTokens] = useState("0");
  const [withdrawMode, setWithdrawMode] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    "0x8EFaf91508c3bFA232a3D5d89C2005774d0A6C38"
  );
  const [dummyLoading, setDummyLoading] = useState(false);
  const [error, setError] = useState(null);

  const [depositLoading, setDepositLoading] = useState(false);
  const [errDeposit, setErrDeposit] = useState(null);
  const [depositAmount, setDepositAmount] = useState();
  const getBalance = async () => {
    console.log("called");
    try {
      const udscContract = new ethers.Contract(
        USDCCONTRACTADDRESS,
        USDCABI,
        signer
      );
      console.log(smartContractAccountAddress);
      console.log(udscContract);

      const balance = await udscContract.balanceOf(smartContractAccountAddress);
      const bigNumber = ethers.BigNumber.from(balance);
      console.log(balance);
      console.log(balance);
      setTokens(bigNumber.toString());
    } catch (error) {
      console.error("Error in getBalance:", error);
      if (error.code === "CALL_EXCEPTION") {
        console.error(
          "Contract call failed. The contract might not exist on this network."
        );
        // setError("Contract not found. Please check your network connection.");
      } else if (error.code === "INVALID_ARGUMENT") {
        console.error("Invalid argument provided to the contract call.");
        // setError("Invalid address. Please check the contract address.");
      } else {
        console.error("An unexpected error occurred.");
        // setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  console.log(tokens);

  useEffect(() => {
    if (signer && ready && authenticated && w0) {
      getBalance();
    }
  }, [signer, ready, authenticated, w0]);

  const getFhevmInstance = async () => {
    const instance = await getInstance();
    setFhevmInstance(instance);
  };

  useEffect(() => {
    getFhevmInstance();
  }, []);

  useEffect(() => {
    if (tokens !== "0") {
      setDepositAmount(tokens.slice(0, -18));
    }
  }, [tokens]);

  const address = w0?.address;

  const handlePayBtn = async () => {
    try {
      setDummyLoading(true);
      const usdcContract = await new Contract(
        USDCCONTRACTADDRESS,
        USDCABI,
        signer
      );

      const txData = await usdcContract.transferFromOwner(
        TOKENBRIDGECONTRACTADDRESS
      );
      txData.wait(1);

      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setDummyLoading(false);
    }
  };

  const handleDeposit = async () => {
    console.log(signer);
    const value = ethers.utils.parseUnits(depositAmount, "ether");
    try {
      const tokenBridge = new Contract(
        TOKENBRIDGECONTRACTADDRESS,
        TOKENBRIDGEABI,
        signer
      );
      const txData = await tokenBridge.lockTokens(value, { gasLimit: 7920027 });
      txData.wait(1);
      console.log("first");
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const usdcContract = new Contract(USDCCONTRACTADDRESS, USDCABI, signer);
      const balance = await usdcContract.balanceOf(smartContractAccountAddress);
      const txData = await usdcContract.populateTransaction.transfer(
        withdrawAmount,
        balance,
        {
          gasLimit: 7920027,
        }
      );
      const tx1 = {
        to: USDCCONTRACTADDRESS,
        data: txData.data,
      };
      const userOpResponse = await signer?.sendTransaction(tx1, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      await userOpResponse.wait(4);
      console.log("get");
      console.log(userOpResponse);
      await getBalance();
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === "deposit") {
      setDepositLoading(true);
      await handleDeposit();
      setDepositLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="mt-4">
        <Header
          authenticated={authenticated}
          address={address}
          smartAccountAddress={smartContractAccountAddress}
        />
        <div>
          <main className="container mx-auto px-4 py-12">
            <motion.div
              className="max-w-md mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={childVariants}
                className="text-3xl font-bold text-foreground mb-4"
              >
                Secure & Confidential Transactions
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-foreground/40 mb-8"
              >
                Manage your finances with complete privacy and ease.
              </motion.p>

              <motion.div
                variants={childVariants}
                className="inline-flex rounded-full p-1 border border-foreground/40 bg-background mb-8"
              >
                <AnimatePresence mode="wait">
                  {["deposit", "onramp"].map((tab) => (
                    <motion.button
                      key={tab}
                      className={`px-6 py-2 rounded-full transition-colors ${
                        activeTab === tab
                          ? "bg-foreground text-background"
                          : "text-foreground"
                      }`}
                      onClick={() => {
                        setActiveTab(tab);
                        tab === "deposit" && getBalance();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tab === "onramp"
                        ? "On Ramp"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>

              <motion.div
                variants={childVariants}
                className="bg-background rounded-lg border border-foreground/40 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground/80">
                    {activeTab === "deposit" ? "Deposit Funds" : "On Ramp"}
                  </h3>
                  <Button
                    onClick={handlePayBtn}
                    // disabled={dummyLoading}
                    className="flex items-center space-x-2 bg-[#0B0E11] hover:bg-[#0B0E11]/70 border border-foreground/40 text-background"
                  >
                    <CoinsIcon className={dummyLoading ? "animate-spin" : ""} />
                    <span>{dummyLoading ? "Minting..." : "Mint USDC"}</span>
                  </Button>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={`Amount to ${activeTab}`}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all text-black"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {activeTab === "deposit" && (
                      <div className="text-sm w-full flex items-center text-left">
                        Available Balance:&nbsp;
                        <span className="font-semibold text-[#FCD535]">
                          {" "}
                          $ {tokens === "0" ? "0" : tokens.slice(0, -18)}
                        </span>
                      </div>
                    )}

                    {activeTab === "onramp" && (
                      <Input
                        type="text"
                        placeholder="Wallet address"
                        className="w-full py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all text-black"
                      />
                    )}
                    <Button
                      className="w-full rounded-md py-2 font-medium text-sm text-black bg-[#FCD535] hover:bg-[#FCD535]/70 active:bg-[#FCD535] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={depositLoading || activeTab === "onramp"}
                    >
                      {depositLoading ? (
                        <span className="flex items-center justify-center">
                          <CoinsIcon className="animate-spin mr-2" size={16} />
                          Processing...
                        </span>
                      ) : activeTab === "deposit" ? (
                        "Deposit Now"
                      ) : (
                        "On Ramp Now (coming soon)"
                      )}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export const Header = ({ authenticated, address, smartAccountAddress }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user,
    handleLogOut: logout,
  } = useDynamicContext();
  const dispatch = useDispatch();
  const { navigation } = useSelector((state) => state.navigation);
  const [nav, setNav] = useState(navigation);
  useEffect(() => {
    setNav(navigation);
  }, [navigation]);

  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };
  const handleLogout = () => {
    logout();
    dispatch(setNavigation(null));
  };
  const copyAddress = (smartAccountAddress) => {
    console.log("first");
    try {
      navigator.clipboard.writeText(`${smartAccountAddress}`);
    } catch (error) {
      console.log(error);
    }
    toast({
      title: "Copied to clipboard!",
      // description: "Address, copied to clipboard",
    });
  };
  return (
    <div className="flex justify-between items-center scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0 pb-4 border-b border-black/20 px-8">
      <div
        className="text-2xl md:flex items-center gap-2 hidden"
        onClick={() => handleNavigation("/")}
      >
        {nav === "/pay" ? "Payroll Protocol" : "Payroll Protocol"}
        {/* Distribition per address */}
      </div>
      <div className="text-xl text-foreground/70 flex items-center gap-2 md:hidden">
        {truncateAddress(address)}
        <div onClick={() => copyAddress(address)}>
          <CopyIcon className="text-foreground/40 hover:text-foreground hover:scale-110 transition-all ease-in-out duration-300 w-4" />
        </div>
      </div>

      <div className="text-xl text-foreground/70  flex gap-3 items-center justify-center">
        <Button
          size="sm"
          // onClick={logout}
          variant="neutral"
          className="gap-2 md:hidden flex items-center justify-between bg-red-500 text-foreground"
        >
          <LogOutIcon />
          Logout
        </Button>
        <div className="hidden md:flex">
          <DropDown authenticated={authenticated} address={address} />
        </div>
        {/* <DropDown authenticated={authenticated} address={address} /> */}
      </div>
    </div>
  );
};

const DropDown = ({ authenticated, address }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user,
    handleLogOut: logout,
  } = useDynamicContext();
  const copyAddress = (smartAccountAddress) => {
    try {
      navigator.clipboard.writeText(`${smartAccountAddress}`);
    } catch (error) {
      console.log(error);
    }
    toast("Copied to clipboard!");
  };
  const [isOpen, setIsOpen] = useState(false);
  // const { login, logout } = usePrivy();
  const { navigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };
  // const { wallets } = useWallets();
  // const w0 = wallets[0];
  // const [tokens, setTokens] = useState("0");
  // const { token } = useSelector((tok) => tok.tokens);
  // console.log(token);
  // const accountAddress = w0?.address?.slice(0, 6)?.toLocaleLowerCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };
  return (
    <div className="relative">
      {authenticated ? (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 font-semibold">
            {/* <GiToken className="" /> */}
            <div onClick={() => copyAddress(address)}>
              <CopyIcon className="hover:scale-110 transition-all ease-in-out duration-300 w-4" />
            </div>

            {/* <p> {token === "0" ? "0" : token.slice(0, -18)}</p> */}
          </div>
          <button
            onBlur={() => [setIsOpen(false)]}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="flex items-center gap-2 text-xl font-base"
          >
            {truncateAddress(address)}
            {/* {accountAddress}.... */}
            <ChevronDown
              className={clsx(
                isOpen ? "rotate-180" : "rotate-0",
                "h-5 w-5 transition-transform"
              )}
              color="white"
            />
          </button>
        </div>
      ) : (
        <DynamicConnectButton
          onBlur={() => [setIsOpen(false)]}
          // onClick={login}
          className="flex items-center gap-2 text-xl font-base"
        >
          Login
        </DynamicConnectButton>
      )}

      <div
        className={clsx(
          isOpen
            ? "visible top-12 opacity-100 right-1"
            : "invisible top-10 right-1 opacity-0",
          "absolute flex w-[170px] flex-col rounded-md border-2  bg-white text-lg font-base transition-all text-black"
        )}
      >
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/deposit");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black/40 "
        >
          <PiggyBank className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Deposit
        </div>
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/pay");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black/40 "
        >
          <BanknoteIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Pay
        </div>
        <div
          onClick={() => {
            setIsOpen(false);
            handleNavigation("/withdraw");
          }}
          className="text-left hover:bg-black/10 flex items-center px-4 py-3 border-b-2 border-b-black/40 "
        >
          <CoinsIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Withdraw
        </div>

        <div
          onClick={handleLogout}
          className="text-left hover:bg-red-600  flex items-center px-4 py-3  bg-red-500 text-white"
        >
          <LogOutIcon className="h-6 w-6 m500:h-4 m500:w-4 mr-[15px] m400:ml-4 m400:w-[12px]" />
          Logout
        </div>
      </div>
    </div>
  );
};
