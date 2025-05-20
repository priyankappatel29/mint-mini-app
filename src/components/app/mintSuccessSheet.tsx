import { sdk } from "@farcaster/frame-sdk";
import { useCallback } from "react";

import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";

interface MintSuccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  imageUrl: string;
}

export function MintSuccessSheet({
  isOpen,
  onClose,
  name,
  imageUrl,
}: MintSuccessSheetProps) {
  const handleShare = useCallback(() => {
    sdk.actions.composeCast({
      text: `I just collected ${name} by @priyanka`,
      embeds: ["frames-in-blue.vercel.app/"],
    });
  }, [name]);

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-card">
        <DrawerTitle className="sr-only">collection successful</DrawerTitle>

        <div className="flex flex-col items-center pt-4 pb-4">
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold">collected!</span>
          </div>
        </div>

        <div className="max-w-[256px] mx-auto w-full">
          <div className="bg-mat p-2 shadow mb-4">
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mb-2 px-32">
          <Button className="w-full" onClick={handleShare}>
            share
          </Button>
        </div>

        <div className="pb-4" />
      </DrawerContent>
    </Drawer>
  );
}
