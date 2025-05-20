// config.ts
import type { Address } from "viem";
import { base } from "viem/chains"; 

/**
 * NFT Metadata Configuration (Remains mostly the same for display)
 */
export const mintMetadata = {
  name: "framed in blue #4",
  description:
    "i'll lead you up, to the highest heavens",
  imageUrl: "/framedinblue4_v.png", // Ensure this path is correct if served from your frontend's public dir
  creator: {
    name: "priyanka",
    fid: 6373,
    profileImageUrl: "https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/6e9f0068-0e44-4d03-0d25-d498fc309b00/original",
  },
  chain: "Base",
  priceUsdc: "6.29", // USDC price for the mint
  manifoldFeeEth: "0.0005", // Manifold ETH fee
  startsAt: null,
  endsAt: null,
  isMinting: true,
} as const;

/**
 * USDC Contract Configuration (Using Base Mainnet USDC)
 */
export const usdcContractConfig = {
  // Base Mainnet USDC Contract Address
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address,
  abi: [
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "value", type: "uint256" }],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
  decimals: 6, // USDC typically has 6 decimals
  // Removed approvalAmount: MAX_UINT256 - this will be handled dynamically
} as const;

/**
 * Manifold Claim Contract Configuration
 */
export const contractConfig = {
  // Replace with your actual Manifold Claim Contract address
  address: "0x26BBEA7803DcAc346D5F5f135b57Cf2c752A02bE" as Address,
  chain: base,
  // Replace with your actual Creator NFT Contract address
  creatorContractAddress: "0x22FbD94Bfc652dcb8B7958Dda318566138D4bedC" as Address,
  // Replace with your actual claim instanceId
  instanceId: 4214018288,
  // Replace if your mintIndex is different (often 0 for the first token config)
  mintIndex: 3,

  abi: [
    {
      inputs: [
        { internalType: "address", name: "creatorContractAddress", type: "address" },
        { internalType: "uint256", name: "instanceId", type: "uint256" },
        { internalType: "uint32", name: "mintIndex", type: "uint32" },
        { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" },
        { internalType: "address", name: "mintFor", type: "address" }
      ],
      name: "mint",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "creatorContractAddress", type: "address" },
        { internalType: "uint256", name: "instanceId", type: "uint256" },
      ],
      name: "getClaim",
      outputs: [
        {
          components: [
            { internalType: "uint32", name: "total", type: "uint32" },
            { internalType: "uint32", name: "totalMax", type: "uint32" },
            { internalType: "uint32", name: "walletMax", type: "uint32" },
            { internalType: "uint48", name: "startDate", type: "uint48" },
            { internalType: "uint48", name: "endDate", type: "uint48" },
            { internalType: "enum ILazyPayableClaim.StorageProtocol", name: "storageProtocol", type: "uint8" },
            { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
            { internalType: "string", name: "location", type: "string" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint256", name: "cost", type: "uint256" },
            { internalType: "address payable", name: "paymentReceiver", type: "address" },
            { internalType: "address", name: "erc20", type: "address" },
            { internalType: "address", name: "signingAddress", type: "address" },
          ],
          internalType: "struct IERC1155LazyPayableClaim.Claim",
          name: "claim",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
} as const;

/*
Farcaster Frame Embed Configuration
 */
export const embedConfig = {
  version: "next",
  imageUrl: "https://bbf7c36b-41d9-4f2c-89e4-effcddf0f0b6-00-3tr4td3x18yww.picard.replit.dev/framedinblue4.png", // This should be the direct URL to the image for the frame
  button: {
    title: "collect",
    action: {
      type: "launch_frame", // This action type means clicking the button in Farcaster will open another frame
      name: "frames in blue",     // Name for the frame action
      url: "https://bbf7c36b-41d9-4f2c-89e4-effcddf0f0b6-00-3tr4td3x18yww.picard.replit.dev/", // URL that serves the frame to be opened
      // splashImageUrl: "/bluesplash.png",
      // splashBackgroundColor: "#151515",
    },
  },
} as const;

/**
 * Main App Configuration
 */
export const config = {
  ...mintMetadata,
  contract: contractConfig,
  usdcContract: usdcContractConfig,
  embed: embedConfig,
} as const;