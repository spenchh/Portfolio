# Portfolio

The portfolio of Spencer Kogoma — FPGA, RTL, and digital hardware.

A single self-contained `index.html` with embedded CSS and JavaScript.
Dark, typographic, and minimal: a numbered section index, monospace
microtype, and project detail kept behind disclosure rows so the page
stays sparse until you ask it for depth.

- No build step, no dependencies, no framework
- One web font (JetBrains Mono); everything else is a system stack
- Respects `prefers-reduced-motion`

## Local preview

```
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Optional files

Drop these next to `index.html` and the page picks them up:

| File | Used for |
| --- | --- |
| `amentum-logo.svg` | Logo beside the hero status line (hidden if absent) |
