# Provenance Packet Specification

A buildable React app (Vite + React 18) rendering the **Provenance Packet Spec — Audit-Truth Layer** UI: an institutional, ISO-style, deterministic spec viewer for cryptographically-anchored settlement evidence bundles.

## Stack

- React 18.3
- Vite 5
- Tailwind-style utility classes (vendored in `src/index.css`)

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Structure

```
index.html              # Vite entry HTML
src/
  main.jsx             # React root
  App.jsx              # Spec viewer (all sections)
  TreeView.jsx         # Interactive packet file-tree explorer
  data.js              # Packet tree + manifest.json content
  index.css           # Tailwind utility classes + fonts
artifacts/
  dbai-dashboard.html # Standalone DBAI v1.0 dashboard (single file, React via CDN)
```

## What it renders

- Hero / spec meta
- §1 Definition
- §2 Interactive file-tree visualization of the provenance packet
- §3 manifest.json schema + SHA256 → IPFS CID → AuditAnchor.sol flow
- §4 Three properties of audit truth (Determinism, Completeness, Integrity)
- §5 Chain-of-custody integrity flow
- §6 Replay verification protocol (for CPA / regulator)
- §7 Variance flag taxonomy
