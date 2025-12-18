import fs from "fs/promises";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  description?: string;
  tags?: string[];
  readingTime?: string;
  featured?: boolean;
};

export type BlogPostMeta = BlogFrontmatter;

export type BlogPost = BlogFrontmatter & {
  content: string;
};

type ParsedFrontmatter = {
  data: Record<string, unknown>;
  content: string;
};

/**
 * Very small frontmatter parser for our MDX files.
 * Expects a block like:
 *
 * ---
 * title: "Title"
 * slug: "slug"
 * tags:
 *   - Tag 1
 *   - Tag 2
 * featured: true
 * ---
 *
 * Everything after the closing --- is returned as `content`.
 */
function parseFrontmatter(raw: string): ParsedFrontmatter {
  if (!raw.startsWith("---")) {
    return { data: {}, content: raw };
  }

  const lines = raw.split("\n");
  // Find closing '---'
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    // No closing '---' found
    return { data: {}, content: raw };
  }

  const frontmatterLines = lines.slice(1, endIndex);
  const contentLines = lines.slice(endIndex + 1);
  const data: Record<string, unknown> = {};

  let currentArrayKey: string | null = null;

  const setScalar = (key: string, rawValue: string) => {
    let value = rawValue.trim();

    // Strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value === "true") {
      data[key] = true;
    } else if (value === "false") {
      data[key] = false;
    } else {
      data[key] = value;
    }
  };

  for (const rawLine of frontmatterLines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Array item
    if (line.startsWith("- ")) {
      if (currentArrayKey) {
        const item = line.slice(2).trim();
        const existing = (data[currentArrayKey] as string[]) || [];
        let value = item;
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        data[currentArrayKey] = [...existing, value];
      }
      continue;
    }

    // New key
    const keyMatch = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!keyMatch) {
      continue;
    }

    const key = keyMatch[1];
    const valuePart = keyMatch[2];

    if (valuePart === "") {
      // Start of an array block (e.g. tags:)
      currentArrayKey = key;
      data[key] = [];
    } else {
      currentArrayKey = null;
      setScalar(key, valuePart);
    }
  }

  const content = contentLines.join("\n").trimStart();
  return { data, content };
}

async function readPostFile(
  slug: string
): Promise<{ frontmatter: BlogFrontmatter; content: string } | null> {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = parseFrontmatter(raw);

    const frontmatter: BlogFrontmatter = {
      title: (data.title as string) ?? slug,
      slug: (data.slug as string) ?? slug,
      date: (data.date as string) ?? new Date().toISOString(),
      excerpt: (data.excerpt as string) ?? "",
      description: (data.description as string) ?? undefined,
      tags: (data.tags as string[]) ?? [],
      readingTime: (data.readingTime as string) ?? undefined,
      featured: (data.featured as boolean) ?? false,
    };

    return { frontmatter, content };
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const slugs = await getBlogSlugs();
  const posts: BlogPostMeta[] = [];

  for (const slug of slugs) {
    const parsed = await readPostFile(slug);
    if (parsed) {
      posts.push(parsed.frontmatter);
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  return getBlogPosts();
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  // First, try to read by filename (slug matches filename)
  const parsed = await readPostFile(slug);
  if (parsed) {
    // If the frontmatter slug matches, return it
    if (parsed.frontmatter.slug === slug) {
      return {
        ...parsed.frontmatter,
        content: parsed.content,
      };
    }
  }

  // If not found by filename, search all files for matching frontmatter slug
  const allSlugs = await getBlogSlugs();
  for (const fileSlug of allSlugs) {
    const parsed = await readPostFile(fileSlug);
    if (parsed && parsed.frontmatter.slug === slug) {
      return {
        ...parsed.frontmatter,
        content: parsed.content,
      };
    }
  }

  return null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug);
}
