export const opSepoliaTestnet = {
  id: 11155420,
  network: "OP Sepolia Testnet",
  name: "OP Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://optimism-sepolia.blockpi.network/v1/rpc/public"],
    },
    public: {
      http: ["https://optimism-sepolia.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://optimism-sepolia.blockscout.com",
    },
  },
};

export const oasisSapphireTestnet = {
  id: 23295,
  network: "Oasis Sapphire Testnet",
  name: "sapphire-testnet",
  nativeCurrency: {
    name: "TEST",
    symbol: "TEST",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.sapphire.oasis.io"],
    },
    public: {
      http: ["https://testnet.sapphire.oasis.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Oasis Scan",
      url: "https://testnet.oasisscan.com/",
    },
  },
};

export const heliumFhenix = {
  id: 8008135,
  network: "Helium Fhenix",
  name: "Helium",
  nativeCurrency: {
    name: "tFHE",
    symbol: "tFHE",
    decimals: 18, // Assuming 18 decimals, please adjust if different
  },
  rpcUrls: {
    default: {
      http: ["https://api.helium.fhenix.zone"],
    },
    public: {
      http: ["https://api.helium.fhenix.zone"],
    },
  },
  blockExplorers: {
    default: {
      name: "Helium Fhenix Explorer",
      url: "https://explorer.helium.fhenix.zone",
    },
  },
};
