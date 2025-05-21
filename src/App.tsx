import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import { CollectButton } from "./components/app/collectButton";
import { ArtworkCard } from "./components/app/artworkCard";
import { MintErrorSheet } from "./components/app/mintErrorSheet";
import { MintSuccessSheet } from "./components/app/mintSuccessSheet";
import { mintMetadata } from "./config";

function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <ArtworkCard
        imageUrl={mintMetadata.imageUrl}
        name={mintMetadata.name}
        creator={{
          name: mintMetadata.creator.name,
          profileImageUrl: mintMetadata.creator.profileImageUrl,
          fid: mintMetadata.creator.fid,
        }}
        chain={mintMetadata.chain}
        description={mintMetadata.description}
        isMinting={mintMetadata.isMinting}
        attributes={mintMetadata.attributes} // ADD THIS LINE
      >

        <CollectButton
          priceUsdc={mintMetadata.priceUsdc}
          manifoldFeeEth={mintMetadata.manifoldFeeEth}
          isMinting={mintMetadata.isMinting}
          onCollect={() => setShowSuccess(true)}
          onError={setError}
        />
      </ArtworkCard>


      <MintSuccessSheet
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        name={mintMetadata.name}
        imageUrl={mintMetadata.imageUrl}
      />

      <MintErrorSheet
        isOpen={!!error}
        onClose={() => setError(undefined)}
        error={error}
      />
    </div>
  );
}

export default App;