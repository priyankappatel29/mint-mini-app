import { base } from 'wagmi/chains';

export const contracts = {
  nft: {
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Replace with actual address
    chain: base,
    abi: [
      // Minimal ABI for minting
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
  },
};

// Function to generate mint transaction data
export function getMintTransaction(address: `0x${string}`) {
  return {
    to: contracts.nft.address,
    data: '0x6a627842' as `0x${string}`, // mint function selector + parameters
    value: BigInt(10000000000000000), // 0.01 ETH in wei
  };
}
