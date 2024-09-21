"use client";
import PatientList from "@/modules/doctor/patientsTable";
import MainDocLayout from "@/layout/doctor";
import { useWalletContext } from "@/privy/walletContext";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  delegateSignAttestation,
  delegateSignRevokeAttestation,
  delegateSignSchema,
} from "@ethsign/sp-sdk";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { signer, w0, address, isLoading, error } = useWalletContext();
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.optimismSepolia,
  });

  console.log(client);


  async function createNotaryAttestation(contractDetails, signer) {
    const res = await client.createAttestation({
      schemaId: "0x32",
      data: {
        contractDetails,
        signer,
      },
      indexingValue: signer.toLowerCase(),
    });

    console.log(res);
  }

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
    <Button onClick={createNotaryAttestation}>GET</Button>
    // <MainDocLayout path={["Patients"]}>
    //   <PatientList />
    // </MainDocLayout>
  );
};

export default Page;
