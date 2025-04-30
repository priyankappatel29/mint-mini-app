import type { Address } from "viem";
import { base } from "viem/chains";

export const config = {
  // Mint metadata
  name: "Mini App Mint Demo",
  description: "A simple example of an onchain action in a Farcaster mini app.",
  imageUrl: "/nft.png",
  creator: {
    name: "horsefacts.eth",
    fid: 3621,
    profileImageUrl: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/27ebb092-6f26-4397-6027-8c90d909ce00/original",
  },
  chain: "Base",
  priceEth: "0.0008",
  startsAt: null,
  endsAt: null,
  isMinting: true,
  // Contract config
  contract: {
    address: "0xd9E58978808d17F99ccCEAb5195B052E972c0188" as Address,
    chain: base,
    abi: [
      {
        inputs: [
          { internalType: "uint256", name: "vectorId", type: "uint256" },
          { internalType: "uint48", name: "numTokensToMint", type: "uint48" },
          { internalType: "address", name: "mintRecipient", type: "address" },
          { internalType: "address", name: "referrer", type: "address" },
        ],
        name: "vectorMint721WithReferral",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      { inputs: [], name: "InvalidReferrer_ReferralManager", type: "error" },
    ] as const,
    vectorId: 6506,
    referrer: "0x075b108fC0a6426F9dEC9A5c18E87eB577D1346a" as Address,
  },
  // Embed attributes
  embed: {
    version: "next",
    imageUrl: "/nft.png",
    button: {
      title: "Mint",
      action: {
        type: "launch_frame",
        name: "NFT Mint",
        url: "https://your-app-url.com",
      },
    },
  },
};
