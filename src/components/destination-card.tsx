import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/content";

export default function DestinationCard({ destination, index, feature = false }: { destination: Destination; index: number; feature?: boolean }) {
  return (
    <Link className={`destination-card ${feature ? "destination-card--feature" : ""}`} href={`/destinations/${destination.slug}`} aria-label={`Discover ${destination.name}`}>
      {destination.image ? (
        <Image className="destination-card__image" src={destination.image.src} alt={destination.image.alt} fill sizes={feature ? "(max-width: 700px) 100vw, 58vw" : "(max-width: 700px) 50vw, 25vw"} />
      ) : (
        <span className="destination-card__abstract" aria-hidden="true" />
      )}
      <span className="destination-card__content">
        <span className="destination-card__number">0{index + 1} / Destination</span>
        <h3 className="destination-card__title">{destination.name}</h3>
        <span className="destination-card__meta"><span>{destination.region}</span><span aria-hidden="true">↗</span></span>
      </span>
    </Link>
  );
}
