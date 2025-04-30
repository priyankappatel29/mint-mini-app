import type { Address } from "viem";
import { encodeFunctionData, parseEther } from "viem";
import { config } from "./config";

export function getMintTransaction(mintTo: Address) {
  return {
    to: config.contract.address,
    data: encodeFunctionData({
      abi: config.contract.abi,
      functionName: "vectorMint721WithReferral",
      args: [
        BigInt(config.contract.vectorId),
        1,
        mintTo,
        config.contract.referrer,
      ],
    }),
    value: parseEther(config.priceEth),
    chainId: config.contract.chain.id,
  };
}
