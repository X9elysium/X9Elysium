# MCP servers — setup

Project-scoped MCP config lives at the repo root in `.mcp.json`. Claude Code reads it on session start when CWD is this repo.

## What's wired up

| Server | Package | What it does |
| --- | --- | --- |
| `github` | `@modelcontextprotocol/server-github` | Repo, PR, issue, workflow ops without leaving the agent. |
| `cloudflare` | `@cloudflare/mcp-server-cloudflare` | Workers, KV, D1, R2, deployments — the deploy surface for x9elysium.com. |
| `filesystem` | `@modelcontextprotocol/server-filesystem` | Sandboxed read/write to this repo only (path locked in `.mcp.json`). |
| `fetch` | `@modelcontextprotocol/server-fetch` | Plain HTTP fetcher for arbitrary URLs (no auth). |

No secrets live in `.mcp.json` — every credential is read from your shell env.

## One-time setup

### 1. GitHub

Create a fine-grained PAT at <https://github.com/settings/tokens?type=beta>. Scope to the X9Elysium repo. Required permissions: Contents (RW), Issues (RW), Pull requests (RW), Workflows (RW).

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...
```

Add to `~/.zshrc` to persist. Rotate every 90 days.

### 2. Cloudflare

Token: <https://dash.cloudflare.com/profile/api-tokens> → "Create Token" → "Edit Cloudflare Workers". Account ID: dashboard sidebar.

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
```

These are the same values the GH Actions deploy workflow uses. Local shell is the right place — never commit them.

### 3. Filesystem and fetch

Nothing. They run with no credentials.

## Activate

```bash
# from repo root
claude
# inside Claude Code:
/mcp
```

`/mcp` lists servers and their connection state. First run will `npx` the packages and prompt to approve each tool surface. After that the manifest is cached.

## Trust posture

- **`.mcp.json` is committed.** Servers and args are public. Credentials are not.
- **Filesystem is path-locked** to `/Users/darsh/Desktop/X9Elysium`. It cannot read outside the repo.
- **Cloudflare and GitHub tokens** sit in your shell, never in the file. If the file leaks, no creds leak with it.
- **`fetch`** can hit arbitrary URLs. If you don't want that, comment it out of `.mcp.json`.

## Removing a server

Delete its block from `.mcp.json` and restart Claude Code. The `npx` cache stays warm but the server stops being invoked.

## Why these four

- **GitHub + Cloudflare** = the entire deploy surface. Most deploy/PR/secrets work happens here.
- **Filesystem** = redundant with built-in Read/Edit, but lets future MCP-aware tools sandbox correctly to this repo.
- **Fetch** = lighter than WebFetch when we just need a URL grab without LLM rendering.

Add a server only if it serves at least one of the three jobs in `CLAUDE.md` §1. Don't accumulate.
