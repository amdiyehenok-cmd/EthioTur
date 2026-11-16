import Link from "next/link";
import type { providers as providerSchema } from "@/db/schema";

export type ProviderRecord = typeof providerSchema.$inferSelect;

export default function ProviderDirectory({ providers }: { providers: ProviderRecord[] }) {
  return (
    <div className="content-cards" aria-label="Administrator-approved local experience providers">
      {providers.map((provider) => (
        <Link className="content-card" key={provider.id} href={`/marketplace/providers/${provider.slug}`}>
          <span className="content-card__label">{provider.type} · {provider.location}</span>
          <h2>{provider.name}</h2>
          <p>{provider.description}</p>
          <span className="content-card__foot"><span>Administrator-approved listing · inquiry only</span><span aria-hidden="true">↗</span></span>
        </Link>
      ))}
    </div>
  );
}
