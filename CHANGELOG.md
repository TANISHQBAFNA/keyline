# Changelog

## Unreleased — toolchain upgrade (2026-09-20)

Framework and test-runner bump only. No UI redesign, no Figma API rewrite, no graph-library swap.

### Upgraded

| Package | Before | After |
| --- | --- | --- |
| vite | 5.4.x | 8.3.0 |
| @vitejs/plugin-react | 4.3.x | 6.1.1 |
| typescript | 5.6.x | 5.9.3 (latest 5.x) |
| vitest | 2.1.x | 5.0.1 |
| @playwright/test | 1.62.x | 1.63.0 |
| react / react-dom | 18.3.x | 19.3.0 |
| @types/react / react-dom | 18.3.x | 19.3.0 |
| @xyflow/react | 12.3.x | 12.11.6 |
| zustand | 5.0.1 | 5.0.15 |
| zod | 3.23.x | 3.25.76 |
| @dagrejs/dagre | 1.1.4 | 1.1.8 |
| @types/node | 22.20.1 | 22.20.4 |

React 19 kept: `@xyflow/react@12.11.6` peers `react`/`react-dom` `>=17`. `npm run typecheck`, `npm test`, and `npm run build` all passed on 19.3.0.

Node requirement is now `^22.12.0 || >=24.0.0` (Vitest 5). This environment: Node 22.14.

### Deferred

| Item | Why |
| --- | --- |
| TypeScript 6 / 7 | Request was latest **5.x** |
| Zod 4 | `z.record()` now needs key + value schemas; not a compatible-range bump |
| @dagrejs/dagre 2/3 | Layout still uses `graphlib.Graph()` + `dagre.layout()` from 1.x |
| Vite 6 as a stop | Current stable is Vite 8 (Rolldown). App config still uses `build.rollupOptions`; Vite 8 compatibility layer accepted it |

### How to run

```bash
# Node ^22.12 or >=24
npm install
npm run typecheck
npm test
npm run build
npm run test:e2e   # optional; needs Playwright browsers
npm run dev
```
