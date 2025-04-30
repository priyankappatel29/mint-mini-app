// Configuration for the NFT mint

export const config = {
  name: "Mini App NFT",
  description: "A simple NFT created through a Farcaster mini app",
  imageUrl: "/placeholder-nft.png",
  creator: {
    name: "Demo Creator",
    fid: 1234,
    profileImageUrl: "/placeholder-artist.png",
  },
  chain: "base", // base or mainnet
  priceEth: "0.01",
  priceUsd: 25, // in cents
  startsAt: null, // null means already started
  endsAt: null, // null means no end date
  isMinting: true,

  embed: {
    version: "next",
    imageUrl: "/placeholder-nft.png",
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
