import type { Story } from "@/lib/content";
import type { articles } from "@/db/schema";

export type StoredArticle = typeof articles.$inferSelect;

export function articleBodyToSections(body: string): Story["body"] {
  const blocks = body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const sections: Story["body"] = [];
  for (const block of blocks) {
    if (block.startsWith("## ")) {
      sections.push({ heading: block.slice(3).trim() || "A travel note", paragraphs: [] });
    } else {
      const section = sections[sections.length - 1];
      const text = block.replace(/^#{1,6}\s+/, "").trim();
      if (section) section.paragraphs.push(text);
      else sections.push({ heading: "A travel note", paragraphs: [text] });
    }
  }
  return sections.length ? sections : [{ heading: "A travel note", paragraphs: ["This story is being prepared by the editorial team."] }];
}

export function articleToStory(article: StoredArticle, base?: Story): Story {
  return {
    slug: article.slug,
    title: article.title,
    deck: article.excerpt,
    category: article.category,
    href: base?.href || "/travel-guides",
    author: article.author,
    body: articleBodyToSections(article.body),
    ...(base?.image ? { image: base.image } : {}),
  };
}
