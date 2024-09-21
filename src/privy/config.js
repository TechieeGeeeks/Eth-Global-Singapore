import { oasisSapphireTestnet, opSepoliaTestnet, heliumFhenix } from "./chains";

export const privyConfig = {
  appId: "cltn4pfm807ld12sf83bqr3iy",
  config: {
    logo: "https://your.logo.url",
    appearance: { theme: "dark" },
    loginMethods: ["email"],
    appearance: {
      walletList: ["metamask", "detected_wallets", "rainbow"],
      theme: "dark",
    },
    defaultChain: opSepoliaTestnet,
    supportedChains: [opSepoliaTestnet, heliumFhenix],
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
    },
  },
};
