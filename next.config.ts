import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack does not pick up a lockfile further up the tree.
  turbopack: { root: dirname },
  // No "X-Powered-By: Next.js, Payload" on responses; withPayload adds it unless this is false.
  poweredByHeader: false,
  // The apply form sends a resume of up to 4 MB through a server action (lib/hiring/apply-actions.ts).
  experimental: { serverActions: { bodySizeLimit: "5mb" } },
  // Our Approach became Our Philosophy on 2026-10-11; old links and search results land on the new page.
  async redirects() {
    return [{ source: "/our-approach", destination: "/our-philosophy", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // YouTube poster frames for the interview carousel. Only the thumbnail
      // host is opened up; the players themselves are iframes, not images.
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // Files uploaded in /admin (a new portrait, say), once Vercel Blob holds them.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

// Payload's plugin keeps its server packages out of the client bundle; the
// option matches Payload 3.89's blank template.
export default withPayload(nextConfig, { devBundleServerPackages: false });
