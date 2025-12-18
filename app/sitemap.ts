import type { MetadataRoute } from "next";

import { getAllTours } from "@/lib/data/tours";

import { getAllPackages } from "@/lib/data/packages";

import { getAllPosts } from "@/lib/data/blog";

const baseUrl = "https://savanablu.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, packages, posts] = await Promise.all([
    getAllTours(),
    getAllPackages(),
    getAllPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/zanzibar-tours",
    "/safaris",
    "/blog",
    "/about",
    "/faq",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const tourEntries: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${baseUrl}/zanzibar-tours/${tour.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${baseUrl}/safaris/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...tourEntries,
    ...packageEntries,
    ...postEntries,
  ];
}
