import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

import { ArtworkImage } from "./components/app/artworkImage";
import { ArtworkInfo } from "./components/app/artworkInfo";
import { CollectButton } from "./components/app/collectButton";
import { MintErrorSheet } from "./components/app/mintErrorSheet";
import { MintSuccessSheet } from "./components/app/mintSuccessSheet";
import { Card } from "./components/ui/card";
import { config } from "./config";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <div className="w-full min-h-screen flex flex-col">
      <ArtworkImage imageUrl={config.imageUrl} name={config.name} />
      <Card className="flex flex-col -mt-6 relative z-10 flex-grow pb-4">
        <ArtworkInfo
          name={config.name}
          creator={{
            name: config.creator.name,
            profileImageUrl: config.creator.profileImageUrl,
          }}
          chain={config.chain}
          description={config.description}
          isMinting={config.isMinting}
        />
        <CollectButton
          priceEth={config.priceEth}
          isMinting={config.isMinting}
          onCollect={() => setShowSuccess(true)}
          onError={setError}
        />
      </Card>
      <MintSuccessSheet
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        name={config.name}
        imageUrl={config.imageUrl}
      />
      <MintErrorSheet
        isOpen={!!error}
        onClose={() => setError(undefined)}
        error={error || ""}
      />
    </div>
  );
}

export default App;
