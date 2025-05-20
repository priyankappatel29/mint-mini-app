interface ArtworkImageProps {
  imageUrl: string;
  name: string;
}

export function ArtworkImage({ imageUrl, name }: ArtworkImageProps) {
  return (
    <div className="w-full bg-black">
      <img src={imageUrl} alt={name} className="w-full h-full" />
    </div>
  );
}
