"use client";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const myEvmNetworks = [
  {
    blockExplorerUrls: ["https://explorer-holesky.morphl2.io"],
    chainId: 2810,
    chainName: "Morph Holesky Testnet",
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"], // No icon URL was provided
    name: "Morph Holesky Testnet",
    nativeCurrency: {
      decimals: 18, // Assuming 18 decimals as it's standard for ETH
      name: "Ether",
      symbol: "ETH",
    },
    networkId: 2810, // Assuming networkId is the same as chainId
    rpcUrls: ["https://rpc-quicknode-holesky.morphl2.io"],
    vanityName: "Morph Holesky",
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
