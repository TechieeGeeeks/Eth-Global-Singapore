import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { ArrowRight } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import {
  EthersExtension,
  DynamicContextProvider,
  EthereumWalletConnectors,
  mergeNetworks,
  DynamicConnectButton,
} from "../lib/dynamic";

export const LoginUI = () => {
  const { login } = usePrivy();
  const router = useRouter();

  const handleLogin = (selectedRole) => {
    login();
    if (selectedRole === "doctor") {
      router.push("/doctor");
    } else {
      router.push("/patient");
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px]">
          <CardHeader className="items-center">
            <motion.div
              className="w-32 h-32 relative mb-4 rounded-full overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <img
                src="/logo.png"
                alt="Company Logo"
                layout="fill"
                objectFit="contain"
              />
            </motion.div>
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>
              Please select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full py-8 flex-col space-y-2"
                  onClick={() => handleLogin("patient")}
                >
                  <span>Patient</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full py-8 flex-col space-y-2"
                  onClick={() => handleLogin("doctor")}
                >
                  <span>Doctor</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-center text-gray-500">
            <p>
              By connecting, you agree to our{" "}
              <span className="text-black font-semibold underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-black font-semibold underline cursor-pointer">
                Privacy Policy.
              </span>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
