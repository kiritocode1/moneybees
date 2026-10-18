# Backend stack research (2026-10-08)
Repo: next 16.2.12, react 19.2.4, pnpm, next.config.ts has no cacheComponents (only turbopack root + 2 image hosts). No DB/auth deps yet.
- Convex: regions us-east-1, eu-west-1, ap-southeast-2 (Sydney), ca-central-1. NO Mumbai. https://docs.convex.dev/production/regions
- Convex pricing: Starter $0 PAYG, Pro $25/dev/mo, 1GB files free. https://www.convex.dev/pricing
- PlanetScale Postgres: ap-south (AWS ap-south-1 Mumbai) listed; PS-5 $5 single node, $15 HA. https://planetscale.com/pricing (Postgres-specific region page 404 at /docs/postgres/regions)
- Payload: Next 16 from v3.73.0 (2026-01-23) needs Next 16.2+; v3.81 fixed cacheComponents admin 404s; v3.89.0 (2026-09-10) latest seen, targets Next 16.3.x. https://github.com/payloadcms/payload/releases
- Payload jobs: autoRun not usable on Vercel; use Vercel Cron -> /api/payload-jobs/run. https://payloadcms.com/docs/jobs-queue/schedules
- Payload versions/drafts/autosave: https://payloadcms.com/docs/versions/overview ; per-user attribution not shown in docs schema.
- ctx7 ids: /payloadcms/payload (live preview, custom Field components, draft preview), /websites/convex_dev. No quota errors. 2 ctx7 commands on Payload used, 1 on Convex (library only).
