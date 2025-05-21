import { sdk } from "@farcaster/frame-sdk";
import { useCallback } from "react";
import { cn } from "../../lib/cn";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { config } from "../../config";

interface ArtworkCardProps {
  imageUrl: string;
  name: string;
  creator: {
    name: string;
    profileImageUrl?: string;
    fid?: number;
  };
  chain: string;
  description?: string;
  isMinting: boolean;
  children?: React.ReactNode;
  className?: string;
  attributes?: { trait_type: string; value: string }[];
}

export function ArtworkCard({
  imageUrl,
  name,
  creator,
  chain,
  description,
  isMinting,
  children,
  className,
  attributes,
}: ArtworkCardProps) {
  const handleViewProfile = useCallback(() => {
    if (creator.fid) {
      sdk.actions.viewProfile({
        fid: creator.fid,
      });
    }
  }, [creator.fid]);

  const [mintCount, setMintCount] = useState<number | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchMintCount = async () => {
      try {
        const totalSupply = await publicClient.readContract({
          address: config.contract.creatorContractAddress,
          abi: [
            {
              "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
              "name": "totalSupply",
              "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: "totalSupply",
          args: [config.contract.mintIndex],
        });
        setMintCount(Number(totalSupply));
      } catch (error) {
        console.error("Error fetching mint count:", error);
      }
    };

    fetchMintCount();
  }, [publicClient]);
  
  return (
    <>
      <div className="w-[72%] mx-auto aspect-[2/3] mt-[7%] mb-[13%] bg-black relative">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div
        className={cn(
          "rounded-tr-3xl border rounded-tl-3xl border bg-card text-card-foreground shadow-sm flex flex-col -mt-6 relative z-10 flex-grow pb-4",
          className,
        )}
      >
        <div className="pl-6 pr-6 pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1 w-full">
              {/* <--- NEW CODE BLOCK START --- */}
              <div className="flex items-center justify-between w-full"> {/* NEW: Flex container for title and mint count */}
                <h1 className="text-xl font-semibold">
                  <a href="https://manifold.gallery/base:0x22fbd94bfc652dcb8b7958dda318566138d4bedc/4" target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                </h1>
                {/* Mint count goes here, as a sibling to h1 */}
                {mintCount !== null ? (
                  <p className="text-sm font-semibold text-secondary-foreground">
                    {mintCount} mints
                  </p>
                ) : (
                  <p className="text-sm font-bold text-secondary-foreground">loading...</p>
                )}
              </div>
              {/* <--- NEW CODE BLOCK END --- */}
              <div className="flex flex-row items-center gap-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted">by</span>
                  <button
                    type="button"
                    onClick={handleViewProfile}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    {creator.profileImageUrl && (
                      <Avatar className="h-4 w-4 bg-secondary rounded-full">
                        <AvatarImage src={creator.profileImageUrl} alt={creator.name} />
                      </Avatar>
                    )}
                    <span className="text-sm">{creator.name}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted">on</span>
                  <Avatar className="h-4 w-4 bg-secondary rounded-full">
                    <AvatarImage src="/base-logo.png" alt="Base" />
                  </Avatar>
                  <span className="text-sm">{chain}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm mb-4">
            {isMinting
              ? description?.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < description.split('\n').length - 1 && <br />}
                  </span>
                ))
              : "This mint is closed. Don't miss the next one! Add this frame to get featured mint notifications."}
          </p>
          <div className="my-3 mx-auto w-full border-t border-primary/50"></div> {/* This div is just the line */}
          {/* --- NEW CODE for ATTRIBUTES --- */}
          {attributes && attributes.length > 0 && ( // Only render if attributes exist
            <div className="mb-3"> {/* Container for attributes */}
              <h2 className="text-lg font-semibold mb-2 text-card-foreground">attributes</h2> {/* Section title */}
              <div className="space-y-2"> {/* Vertical spacing between attributes */}
                {attributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-34"> {/* Removed justify-between, added gap-6 */}
                <span className="text-sm text-muted-foreground pl-4 w-1/3 min-w-[100px] flex-shrink-0">{attr.trait_type}</span> {/* Added w-1/3 min-w-[100px] flex-shrink-0 for alignment */}
                <span className="text-sm text-card-foreground">{attr.value}</span> {/* Removed pr-4 */}
              </div>
                ))}
              </div>
            </div>
          )}
          <div className="my-1 mx-auto w-full border-t border-primary/50"></div>
          {/* --- END NEW CODE for ATTRIBUTES --- */}
        </div>
        {children}
      </div>
    </>
  );
}
