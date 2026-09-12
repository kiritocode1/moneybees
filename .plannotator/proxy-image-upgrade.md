# Enable GPT Image 2.5 in the existing proxy

The running CLIProxyAPI is 7.2.110 and does not advertise GPT Image 2.5.
Replace it with the already-built 7.2.158 binary, preserving the existing accounts and configuration.
Prove it with a healthy model list and a successful image-generation request, not only the passing unit test.

```text
today   clients -> CPA 7.2.110 -> saved accounts
after   clients -> CPA 7.2.158 -> saved accounts
```

## Files and service

| File | Today | After |
| --- | --- | --- |
| `~/.local/bin/cli-proxy-api` | Running 7.2.110 binary | 7.2.158, with a copy of the old binary for rollback |
| `~/.cli-proxy-api/*.json` | Saved account credentials | Backed up with restricted permissions, no manual edits |
| `~/.cli-proxy-api/config.yaml` | Existing routing and credentials | Unchanged, backed up |
| `~/.codex/auth.json` and `~/.codex/config.toml` | Existing Codex login and provider | Unchanged, backed up |
| `~/Library/LaunchAgents/com.router-for-me.cliproxyapi.plist` | Existing managed proxy job | Unchanged, restart this job only |

## Execution choices

1. Check the new binary version and create a fresh permission-restricted backup outside the watched account directory. Preserve the previous backup too.
2. Atomically replace the executable and restart its existing launchd job once. This briefly interrupts proxy requests.

```diff
- CLIProxyAPI 7.2.110
+ CLIProxyAPI 7.2.158, commit 5b278561
```

```sh
launchctl kickstart -k "gui/$(id -u)/com.router-for-me.cliproxyapi"
```

3. Wait for the existing local API to respond, check its image models, then send one small image request using its configured API key without printing secrets. Save the output privately and inspect whether it is a valid image. This request can consume image quota.
4. Compare account/config fingerprints and check errors. The proxy may automatically refresh credentials during startup or requests. I will not call refresh/login endpoints, restore stale tokens over newer tokens, or delete any account. Stop on authentication failure.
5. If the new proxy cannot serve normal requests, restore only the old binary and restart the same job. Preserve all account files as they stand.

## Not doing

No OAuth mode switch, logout, new login, manual token refresh, credential replacement, or EasyCLIProxyAPI migration. No Pi extension changes yet. A working image endpoint proves proxy support, not that every Pi model/session exposes an image-generation tool. If Pi still needs integration, report that separately before expanding scope.
