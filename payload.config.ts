import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import { AuditLog } from "./collections/AuditLog";
import { FactSheets } from "./collections/FactSheets";
import { Investors } from "./collections/Investors";
import { LoginChallenges } from "./collections/LoginChallenges";
import { Media } from "./collections/Media";
import { Metrics } from "./collections/Metrics";
import { Products } from "./collections/Products";
import { Users } from "./collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * The Moneybee backend (.plannotator/backend-plan/plan.md). While the platform
 * is being built it runs on Neon and Vercel Blob; before go-live the same
 * config moves to PlanetScale Postgres and S3 in Mumbai by changing the
 * connection string and the storage adapter, nothing else. Emails are only
 * logged until an email adapter is added.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " | Moneybee admin" },
  },
  collections: [FactSheets, Products, Metrics, Investors, Users, AuditLog, Media, LoginChallenges],
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    migrationDir: path.resolve(dirname, "migrations"),
    // Schema changes go through committed migrations, never an automatic push.
    push: false,
  }),
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
