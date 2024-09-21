"use client";
import PatientList from "@/modules/doctor/patientsTable";
import MainDocLayout from "@/layout/doctor";
import { useWalletContext } from "@/privy/walletContext";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { signer, w0, address, isLoading, error } = useWalletContext();
  const { authenticated, ready } = usePrivy();
  if (!ready || !authenticated)
    return (
      <div className="h-screen grid place-items-center">
        <div className="animate-spin text-yellow-400">
          <Loader2 />
        </div>
      </div>
    );

  return (
    <MainDocLayout path={["Patients"]}>
      <PatientList />
    </MainDocLayout>
  );
};

export default Page;
