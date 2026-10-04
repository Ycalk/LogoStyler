# AGENT.md — frontend

Scope: this directory only. SPA implementing two screens of the logo-standardization service:
template creator + editor opened by a share link. Backend/storage/deploy are out of scope here.

## Product in one breath

Event sites show partner logos in fixed-size cards. Incoming files carry huge white/transparent
margins, so visible logo area differs card-to-card and cards look uneven. The service normalizes
**placement of the visible logo part inside a preset plate (плашка)**, not the file size.
Aspect ratio is always preserved: horizontal, square and wordmark logos stay as they are.

Roles: **author** sets plate size, background, safe paddings, export format → gets a URL;
**submitter** opens the URL, uploads a logo, edits it, downloads the result. No accounts, no login.

User-visible terms (UI copy is Russian, keep naming consistent):
plate/плашка, safe area/охранная область, visible logo part, auto-trim/автообрезка, crop frame,
fit, center, guides/направляющие, offset from center, preview, export.

## Hard rules

1. Never auto-modify an uploaded file (F-06). Auto-trim only *proposes* a crop frame; no implicit apply.
2. Service overlay (safe area, crop frame, guides, warnings) lives on its own Konva layer that is
   structurally excluded from the export render — never "hide then snapshot" (AC-13).
3. Drag/scale bounds are computed from the **visible pixel bbox**, not the source rect — margins must
   not be counted as logo area (F-15, AC-08).
4. Aspect ratio is invariant everywhere (scale slider, fit, export).
5. Export size is exactly the plate size in px, background filled, and exports must visually match preview.
6. If a violation of the safe area is somehow present, show a loud warning instead of silently clamping (F-15, AC-09).

## Requirements (IDs are traced in code/tests/commits)

Template creator:
- F-01 width/height: positive integers, px.
- F-02 background color picker, default `#FFFFFF`.
- F-03 safe paddings per side or one value, rendered as a visible safe area.
- F-04 unique share URL carrying template params (saved template → link).
- F-19 export format is chosen by the author.

Editor:
- F-05 accept SVG, PNG, JPG/JPEG; clear message on corrupt/unsupported file.
- F-07 auto-trim (button): detect content bbox → alpha channel first; opaque images → uniform
  background sampled from edges/corners; sets frame only.
- F-08 frame is editable, cancellable, applicable; manual crop always available.
- F-09 after crop apply: fit logo into safe area maximally, keep aspect.
- F-10 then auto-center relative to safe area.
- F-11 scale slider, smooth, aspect-preserving.
- F-12 drag within allowed area.
- F-13 center guides while dragging; center match visibly marked.
- F-14 deviation from center shown visually, deliberate offset allowed.
- F-16 "center" button returns logo to safe-area center.
- F-17 undo of main actions + reset to the original uploaded file.
- F-18 preview of the final plate before export.

## Editor specifics

- Plate rendered at correct aspect ratio; safe-area outline visible only while editing (6.1).
- SVG must render safely: sanitize with `dompurify` (strip scripts/event handlers/foreignObject)
  or rasterize; no script execution in the user's browser (6.3).
- Add-ons from the TZ: deviation-from-center indicator, live safe-area warning, service lines never exported.

## Acceptance

- AC-01 template 400×220 px, bg + 20 px paddings → separate link.
- AC-02 opening the link loads that template's params.
- AC-03 PNG, JPG/JPEG, sanitized SVG upload and render.
- AC-04 manual crop: change frame, apply.
- AC-05 auto-trim proposes frame, does not apply; editable / applicable / cancellable.
- AC-06 after crop: auto-fit, aspect kept, auto-centered.
- AC-07 manual scale + drag work, center guides work.
- AC-08 normal actions cannot push visible pixels outside the safe area.
- AC-09 otherwise → noticeable warning.
- AC-10 center button works.
- AC-11 reset restores original upload; main actions undoable.
- AC-12 export: exact plate size, chosen background, matches preview.
- AC-13 no service lines/guides/warnings in the export.
- AC-14 app starts per the provided instructions.

Full acceptance walkthrough: create template → get link → open as submitter → upload a logo with big
margins → auto-trim or manual crop → review + apply frame → auto fit + center → adjust scale/position →
download the exact-size file.

## Stack (present in package.json)

- React 19 + TypeScript + Vite, SPA, no router yet.
- Tailwind CSS 4 via `@tailwindcss/vite`; shadcn CLI (`components.json`, style `base-nova`) on top of
  `@base-ui/react`; `class-variance-authority`, `cn` package for class merging; `lucide-react` icons;
  `@fontsource-variable/geist`; `next-themes` for light/dark.
- Editor: `konva` + `react-konva` + `use-image` (stage/layers, drag, hit detection, canvas export).
- Crop frame: `react-easy-crop`.
- SVG safety: `dompurify`.
- Editor state: `zustand`; notifications: `sonner`.
- Tooling: `biome` (format/assist), `oxlint` (lint), `tsc -b` in build.

Use Konva layers for the editor core and canvas/`toDataURL`/`toBlob` for export; keep pixel work
(bbox detection, padding math, background fill) in plain TS functions, not in components.

## Layout

```
src/              app sources; only src/ is in tsconfig include — keep new code there
public/           static assets
@/components/ui/  shadcn output, currently outside include and broken (see Gaps)
```

## Commands

```
npm install | npm run dev | npm run build | npm run preview | npm run lint | npm run format
```

## Conventions

- UI copy and error messages: Russian. Code identifiers/comments: English, consistent per file.
- Commits: Conventional Commits, scope `frontend`: `feat(frontend): …`.
- Trace every behavior change to an `F-xx`/`AC-xx` id in code comments, tests and commit body.
- Biome: tabs, double quotes, organize-imports on. Do not add file-level config overrides.
- Dependency-light: reuse the libraries above before adding new ones.
- FileReader/`createImageBitmap` → `HTMLImageElement`/`HTMLCanvasElement`; revoke object URLs;
  handle huge uploads (guard dimensions) and `onerror` on decode.

## Gaps (verified 2026-10-04, branch `feat/13-frontend-framework`)

1. `@/` alias is not configured: no `paths` in `tsconfig*.json`, no `resolve.alias` in `vite.config.ts`.
   shadcn therefore wrote components into the literal `@/components/ui/` dir (button, dialog, input,
   label, slider, sonner), and `@/components/ui/dialog.tsx:5` imports `@/components/ui/button` — an
   unresolved specifier. `tsconfig.app.json` includes only `src`, so `tsc -b` passes (exit 0) and the
   error stays hidden until the first import from `src`. Fix: add `paths` + `resolve.alias`, move dir
   to `src/components/ui/`.
2. `src/App.tsx` / `App.css` / `assets/*` are the stock Vite demo page; replace with the two screens.
3. `tsconfig.app.json` has no `strict` — enable it before writing real logic.
4. `index.html`: `lang="en"` and title `frontend` → `ru`, real title.
5. No tests and no CI yet; `npm run lint` is the only gate.
6. Template params have no source yet (no backend) — during development read them from the query
   string behind a small adapter so the link format is fixed early (AC-02).

## Non-goals

- No AI/ML: auto-trim is plain image processing.
- No mobile layout; target desktop ≥1280 px, current Chrome/Edge/Firefox.
- No accounts, roles, admin panels — MVP is link-based.
- Don't reimplement Konva drag/scale math by hand if a built-in does it; don't add a state manager
  beyond zustand.
