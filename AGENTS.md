# moneybees

Next.js 16, React 19, Tailwind v4, Payload CMS.

Linear tracking lives in `CLAUDE.md`.

## Admin deletes

Every collection in `payload.config.ts` is wrapped with `withDeleteGuard`. The guard is in `lib/backend/delete-guard.ts`, and relation discovery is in `lib/backend/delete-dependencies.ts`.

- Keep the shared guard. Do not replace it with a per-collection blocker list.
- A blocked delete must throw a public `APIError(message, 400)` that names the target and the linked records.
- Message shape: `Deleting <title> is not possible without deleting <count> <records> first.` Show a sample linked title only when that collection has three or fewer blockers.
- Do not cascade, null, archive, or reassign linked records to force a delete through.
- The guard checks required single relations stored on the dependent row. It skips required `hasMany` relations, arrays, blocks, polymorphic relations, and `payload-` system collections.
- Custom Files and Hiring delete flows are separate and stay unchanged unless the task says otherwise.
- For changes to this path, run `node --test lib/backend/delete-dependencies.test.mjs` and exercise a real admin single and bulk delete.
