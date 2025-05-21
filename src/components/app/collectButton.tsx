// CollectButton.tsx
import { sdk } from "@farcaster/frame-sdk";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useEffect, useRef, useState } from "react";
import { parseEther, parseUnits } from "viem";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
  usePublicClient,
  useChainId,
} from "wagmi";

import { config } from "../../config"; // Corrected import
const { contract: manifoldContract, usdcContract } = config;

import { isUserRejectionError } from "../../lib/errors";
import { AnimatedBorder } from "../ui/animatedBorder";
import { Button } from "../ui/button";

interface CollectButtonProps {
  timestamp?: number;
  priceUsdc: string;
  manifoldFeeEth: string;
  onCollect: () => void;
  onError: (error: string | undefined) => void;
  isMinting: boolean;
}

type ActionType = "approve" | "mint";

export function CollectButton({
  priceUsdc,
  manifoldFeeEth,
  onCollect,
  onError,
  isMinting,
}: CollectButtonProps) {
  const { isConnected, address: connectedAddress } = useAccount();
  const { connect } = useConnect();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: manifoldContract.chain.id });

  const { writeContractAsync, isPending: isSubmittingTxViaHook, reset, error: writeContractError } = useWriteContract();
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();
  const {
    isLoading: isTxConfirming,
    isSuccess: isTxSuccessful,
    error: receiptError
  } = useWaitForTransactionReceipt({ hash: currentTxHash });

  const [needsApproval, setNeedsApproval] = useState(true);
  const [isCheckingOrProcessingAllowance, setIsCheckingOrProcessingAllowance] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  const successHandled = useRef(false);
  const usdcAmountToPay = parseUnits(priceUsdc, usdcContract.decimals);

  const checkAllowance = async () => {
    if (!isConnected || !connectedAddress || !publicClient || !isMinting) {
      setNeedsApproval(true);
      return;
    }
    setIsCheckingOrProcessingAllowance(true);
    try {
      const allowance = await publicClient.readContract({
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: "allowance",
        args: [connectedAddress!, manifoldContract.address],
      });
      setNeedsApproval(allowance < usdcAmountToPay);
    } catch (err) {
      console.error("Error checking allowance:", err);
      onError("Could not check USDC allowance.");
      setNeedsApproval(true);
    } finally {
      setIsCheckingOrProcessingAllowance(false);
    }
  };

  useEffect(() => {
    if (isMinting && isConnected && connectedAddress && publicClient && manifoldContract.chain.id === chainId) {
      checkAllowance();
    } else if (!isConnected || (manifoldContract.chain.id !== chainId && isConnected) ) {
      setNeedsApproval(true);
    }
  }, [isConnected, connectedAddress, publicClient, isMinting, chainId, manifoldContract.chain.id]); // Added manifoldContract.chain.id for completeness

  useEffect(() => {
    if (isTxSuccessful && currentTxHash && !successHandled.current) {
      successHandled.current = true;
      if (currentAction === "approve") {
        checkAllowance(); // Re-check allowance, should update `needsApproval` to false
      } else if (currentAction === "mint") {
        onCollect();
      }
      setCurrentTxHash(undefined);
      setCurrentAction(null);
      reset();
    }
    if (!isTxSuccessful && !isTxConfirming && !isSubmittingTxViaHook) {
        successHandled.current = false;
    }
  }, [isTxSuccessful, currentTxHash, currentAction, onCollect, checkAllowance, reset]);

  // Effect to handle errors from hooks
  useEffect(() => {
    const anError = writeContractError || receiptError;
    if (anError && !isUserRejectionError(anError)) {
        onError(anError instanceof Error ? anError.message : "An unexpected error occurred.");
        // Optionally reset states if error is critical
        // setCurrentAction(null);
        // reset();
    }
  }, [writeContractError, receiptError, onError]);


  const handleApprove = async () => {
    if (!connectedAddress) return;
    setCurrentAction("approve");
    successHandled.current = false;
    setIsCheckingOrProcessingAllowance(true);
    try {
      const approveTx = await writeContractAsync({
        address: usdcContract.address,
        abi: usdcContract.abi,
        functionName: "approve",
        // Use the exact amount needed for this mint
        args: [manifoldContract.address, usdcAmountToPay], // spender, exact amount
        chainId: manifoldContract.chain.id,
      });
      setCurrentTxHash(approveTx);
    } catch (err) {
      // Error handling for user rejection is often caught by isUserRejectionError
      // Other errors will be caught by the useEffect for writeContractError
      if (!isUserRejectionError(err as Error)) {
         console.error("USDC Approval Error:", err);
         // onError(err instanceof Error ? err.message : "Failed to approve USDC."); // Already handled by useEffect
      }
      setCurrentAction(null); // Reset action if submission fails immediately
      // reset(); // reset() might be called by error effect too
    } finally {
      setIsCheckingOrProcessingAllowance(false);
    }
  };

  const handleMint = async () => {
    if (!connectedAddress) return;
    setCurrentAction("mint");
    successHandled.current = false;
    const ethFeeWei = parseEther(manifoldFeeEth);
    const merkleProof: `0x${string}`[] = [];

    try {
      const mintTx = await writeContractAsync({
        address: manifoldContract.address,
        abi: manifoldContract.abi,
        functionName: "mint",
        args: [
          manifoldContract.creatorContractAddress,
          BigInt(manifoldContract.instanceId),
          manifoldContract.mintIndex,
          merkleProof,
          connectedAddress,
        ],
        value: ethFeeWei,
        chainId: manifoldContract.chain.id,
      });
      setCurrentTxHash(mintTx);
    } catch (err) {
      if (!isUserRejectionError(err as Error)) {
        console.error("Minting Error:", err);
      }
      setCurrentAction(null);
    }
  };

  const handleClick = async () => {
    reset(); // Clear previous errors/hashes before new action
    if (!isMinting) {
      sdk.actions.addFrame();
      return;
    }
    if (!isConnected || !connectedAddress) {
      connect({ connector: farcasterFrame() });
      return;
    }
    if (chainId !== manifoldContract.chain.id) {
        onError(`Please switch to ${manifoldContract.chain.name} network to continue.`);
        return;
    }

    if (needsApproval) {
      handleApprove();
    } else {
      handleMint();
    }
  };

  const isProcessingAnyAction = isCheckingOrProcessingAllowance || isSubmittingTxViaHook || isTxConfirming;
  let buttonText = "collect - framed in blue";

  if (!isConnected && isMinting) buttonText = "connect wallet";
  else if (!isMinting) buttonText = "Add Frame";
  else if (chainId !== manifoldContract.chain.id && isConnected) buttonText = `Switch to ${manifoldContract.chain.name}`;
  else if (isCheckingOrProcessingAllowance && currentAction !== "approve") buttonText = "checking..."; // Avoid "Checking..." if already in approval process
  else if (isSubmittingTxViaHook || isTxConfirming) {
      if (currentAction === "approve") buttonText = "approving USDC...";
      else if (currentAction === "mint") buttonText = "collecting...";
  }
  else if (needsApproval) buttonText = `approve ${priceUsdc} USDC`;
  // else buttonText remains "collect"; // Default text when ready to mint after approval"


  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card rounded-tr-3xl rounded-tl-3xl border border-border">
      <div className="pb-4 px-6 pt-2">
        {isMinting && (
          <>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-muted text-sm">mint price</span>
              <span className="text-foreground font-medium">{priceUsdc} USDC</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-muted text-sm">manifold fee</span>
              <span className="text-foreground font-medium">{manifoldFeeEth} ETH</span>
            </div>
          </>
        )}
        {isProcessingAnyAction ? (
          <AnimatedBorder>
            <Button className="w-full relative bg-[var(--color-active)] text-[var(--color-active-foreground) rounded-full]" disabled>
              {buttonText}
            </Button>
          </AnimatedBorder>
        ) : (
          <Button className="w-full rounded-full" onClick={handleClick} disabled={isProcessingAnyAction || (isConnected && chainId !== manifoldContract.chain.id)}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}