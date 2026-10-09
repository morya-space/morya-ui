---
title: For agents
order: 11.5
description: Entry point for coding agents / LLMs — what to read first and which tools to call.
---

# For agents

Curated entry for **coding agents / LLMs** using the Morya UI docs site. When generating consumer app pages, follow this order. Do not invent props or introduce APIs that are not documented.

Machine-readable index: [llms.txt](/llms.txt) (site root; emitted when the docs site is built).

## Recommended order

1. [One-shot setup](/docs/setup) / [AI setup](/docs/ai-setup) — install library, Skill, rules, and MCP into the app  
2. [Agent Skill](/docs/agent-skill) — `morya-ui-pages`: surface map and composition contract  
3. [Agent MCP](/docs/mcp) — look up real Props / Events / examples at runtime  
4. Component pages: `/components/{PascalCaseName}` (e.g. [/components/Button](/components/Button))

If an API is unclear: **MCP / docs first — never guess.**

## Must-read conventions

| Topic | Link |
| --- | --- |
| Shared props / Semantic DOM | [Common Props](/docs/common-props) |
| class / style / `pt` landing | [Styling & attrs](/docs/attrs) |
| Naming & semantic type | [Conventions](/docs/conventions) |
| Design tokens `--m-*` | [Design tokens](/docs/design-tokens) |

## Hard rules (summary)

- Compose documented `M*` components and `--m-*` tokens only  
- Appearance vocabulary: semantic `type` / `variant` / `size` (Button: `type` / `color` / `variant`); do not introduce prop names outside the docs  
- Pick by scenario and role — do not copy same-named props blindly  
- Feedback: short results → `message`; summary + detail / async feel → `toast`; confirms → Confirm family  

## Quick links

- Component overview: [/components](/components)  
- Live theme preview: [/theme-editor](/theme-editor)  
- Changelog: [/changelog](/changelog)  
- LLM index: [/llms.txt](/llms.txt)  
- Sitemap: [/sitemap.xml](/sitemap.xml)
