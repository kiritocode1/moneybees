import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack does not pick up a lockfile further up the tree.
  turbopack: { root: dirname },
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
    ],
  },
};

// Payload's plugin keeps its server packages out of the client bundle; the
// option matches Payload 3.89's blank template.
export default withPayload(nextConfig, { devBundleServerPackages: false });
