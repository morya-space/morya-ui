---
title: AI setup
order: 12
description: How @morya-ui/setup, Agent skill, and MCP work together for AI-assisted pages.
---

# AI setup

For **AI-assisted page generation** in consumer apps. Install the library and AI config with [`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) (commands and options: [One-shot setup](/docs/setup)), then follow this page when generating pages.

Hand-written apps can still use only `pnpm add morya-ui` — see [Quick start](/docs/quick-start).

## Recommended flow

1. From the app root run `npx @morya-ui/setup` (or `npx @morya-ui/setup ai` if the library is already installed)
2. **Restart Cursor** (or reload MCP)
3. Have the agent read `DESIGN.md` before generating pages; use golden pages and [Agent Skill](/docs/agent-skill) as needed
4. Look up real APIs via [Agent MCP](/docs/mcp) — do not invent props

## Relation to Skill / MCP

- **[One-shot setup](/docs/setup)**: write the library and AI config into the project  
- **[Agent Skill](/docs/agent-skill)**: on-demand guidance for building pages with `morya-ui`  
- **MCP**: runtime doc lookup for AI clients  

Tools and multi-client configs: [Agent MCP](/docs/mcp). You can configure MCP by hand from that page without running setup.

## Next steps

- [One-shot setup](/docs/setup): `@morya-ui/setup` commands and files  
- [Agent Skill](/docs/agent-skill): when to use `morya-ui-pages`, surface map  
- [Agent MCP](/docs/mcp): tools and client config  
- [Quick start](/docs/quick-start): manual install and a minimal example  
- [Components](/components): browse APIs and previews
