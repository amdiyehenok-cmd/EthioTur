import type { Metadata } from "next";
import AdminConsole from "@/components/admin-console";

export const metadata: Metadata = {
  title: "Content Administration",
  description: "Protected editorial and marketplace moderation workspace.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminPage() {
  return <section className="admin-shell section--paper"><div className="container"><p className="eyebrow eyebrow--dark">ETHIOPIA UNFOLDED · ADMINISTRATION</p><h1 className="serif" style={{ fontSize: "clamp(42px,6vw,66px)", margin: "14px 0 0" }}>The editorial desk.</h1><AdminConsole/></div></section>;
}
