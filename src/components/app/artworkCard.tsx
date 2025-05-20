import { sdk } from "@farcaster/frame-sdk";
import { useCallback } from "react";
import { cn } from "../../lib/cn";
import { Avatar, AvatarImage } from "../ui/avatar";

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
}: ArtworkCardProps) {
  const handleViewProfile = useCallback(() => {
    if (creator.fid) {
      sdk.actions.viewProfile({
        fid: creator.fid,
      });
    }
  }, [creator.fid]);

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
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">
                <a href="https://manifold.gallery/base:0x22fbd94bfc652dcb8b7958dda318566138d4bedc/4" target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </h1>
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
        </div>
        {children}
      </div>
    </>
  );
}
