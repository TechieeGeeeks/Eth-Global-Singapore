const CHAIN_IDS = {
  OP_SEPOLIA: 11155420,
  OASIS_SAPPHIRE: 23295,
  HELIUM_FHENIX: 8008135,
};

const CHAIN_NAMES = {
  [CHAIN_IDS.OP_SEPOLIA]: "OP Sepolia Testnet",
  [CHAIN_IDS.OASIS_SAPPHIRE]: "Oasis Sapphire Testnet",
  [CHAIN_IDS.HELIUM_FHENIX]: "Helium Fhenix",
};

export const switchNetworkFunction = async (wallet, targetChain) => {
  if (!CHAIN_IDS[targetChain]) {
    console.error(`Invalid chain: ${targetChain}`);
    return;
  }

  try {
    await wallet.switchChain(CHAIN_IDS[targetChain]);
    console.log(`Switched to ${CHAIN_NAMES[CHAIN_IDS[targetChain]]}`);
  } catch (error) {
    console.error(
      `Failed to switch to ${CHAIN_NAMES[CHAIN_IDS[targetChain]]}:`,
      error
    );
  }
};
