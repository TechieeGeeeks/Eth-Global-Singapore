"use client";

import { useDispatch } from "react-redux";
import { setNavigation } from "@/redux/slices/navigationSlice";
// import CallToActionSection from "./cta";

export default function LandingPage() {
  const dispatch = useDispatch();
  const navigateDeposit = () => dispatch(setNavigation("/deposit"));
  return (
    <div>
      <Hero navigateDeposit={navigateDeposit} />
      <LogoGrid />
    </div>
  );
}

import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import {
  DynamicConnectButton,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";

const Hero = ({ setSelectedTab }) => {
  const {
    sdkHasLoaded: ready,
    primaryWallet: w0,
    user: authenticated,
    handleLogOut: logout,
  } = useDynamicContext();
  const dispatch = useDispatch();
  const handleNavigation = (to) => {
    dispatch(setNavigation(to));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section>
      <motion.div
        className="custom-screen py-28 text-gray-600"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-5 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl"
            variants={itemVariants}
          >
            We make transactions confidential and easy.
          </motion.h1>
          <motion.p className="max-w-xl mx-auto" variants={itemVariants}>
            We ensure that every transaction is both secure and discreet,
            allowing you to manage your finances with complete privacy.
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-x-3 font-medium text-sm"
            variants={itemVariants}
          >
            {authenticated ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/pay")}
                  className="py-2.5 px-4 text-center rounded-lg duration-150 text-foreground/70 border border-foreground/40 hover:bg-background hover:text-black cursor-pointer"
                >
                  Distribute
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/deposit")}
                  className="py-2.5 px-4 text-center rounded-lg duration-150 text-[#0B0E11] bg-[#F3BA2F] hover:bg-[#F3BA2F]/70 active:bg-[#F3BA2F]/50 cursor-pointer"
                >
                  Deposit
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation("/withdraw")}
                  className="py-2.5 px-4 text-center rounded-lg duration-150 text-foreground/70 border border-foreground/40 hover:bg-background hover:text-black cursor-pointer"
                >
                  Withdraw
                </motion.div>
              </>
            ) : (
              <DynamicConnectButton>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={"fdsvkjb"}
                  className="py-2.5 px-4 text-center rounded-lg duration-150 bg-[#FCD535]  text-[#0B0E11] cursor-pointer"
                >
                  Connect Wallet
                </motion.div>
              </DynamicConnectButton>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const freshbooks = "/logos/freshbooks.svg";
// const sendgrid = "/logos/sendgrid.svg";
const layers = "/logos/layers.svg";
const adobe = "/logos/adobe.svg";

const logos = [
  {
    src: "https://cdn.prod.website-files.com/626692727bba3f384e008e8a/632d74b82fd2862796d5f6a0_logo-dark.svg",
    alt: "freshbooks",
  },
  {
    src: "https://ethglobal.b-cdn.net/organizations/croq1/square-logo/default.png",
    alt: "adobe",
  },
  // { src: sendgrid, alt: "sendgrid" },
  { src: layers, alt: "layers" },
];

const LogoGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/*  */}
      <div className="custom-screen">
        <motion.h2
          className="font-semibold text-sm text-center"
          variants={itemVariants}
        >
          BUILT ON TOP OF THE BEST SOLUTIONS
        </motion.h2>
        <motion.div className="mt-6" variants={itemVariants}>
          <ul className="flex gap-x-10 gap-y-6 flex-wrap items-center justify-center md:gap-x-16">
            {logos.map((item, idx) => (
              <motion.li
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  className={`${
                    item.alt === "layers" ? "w-12 h-12" : " w-32 h-32"
                  }  `}
                  src={item.src}
                  alt={item.alt}
                  initial={{ filter: "grayscale(100%)" }}
                  whileHover={{ filter: "grayscale(0%)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};
