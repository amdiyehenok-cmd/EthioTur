import type { Photo } from "@/lib/content";

export default function PhotoCredit({ photo, className = "" }: { photo: Photo; className?: string }) {
  return <span className={className}>Photo by <a href={photo.creditUrl} target="_blank" rel="noreferrer">{photo.creator} / Pexels</a></span>;
}
