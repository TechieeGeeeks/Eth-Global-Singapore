"use client";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const myEvmNetworks = [
  {
    blockExplorerUrls: ["https://base-sepolia.blockscout.com"],
    chainId: 84532,
    chainName: "Base Sepolia Testnet",
    iconUrls: [], // No icon URL was provided
    name: "Base Sepolia Testnet",
    nativeCurrency: {
      decimals: 18, // Assuming 18 decimals as it's standard for ETH
      name: "Ether",
      symbol: "ETH",
    },
    networkId: 84532, // Assuming networkId is the same as chainId
    rpcUrls: ["https://rpc.notadegen.com/base/sepolia"],
    vanityName: "BaseSepolia",
  },
];

const DynamicWrapper = ({ children }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "6cd56d16-a0bd-46fb-b111-cb062c1a39d2",
        walletConnectors: [EthereumWalletConnectors],
        walletConnectorExtensions: [EthersExtension],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(myEvmNetworks, networks),
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicWrapper;
