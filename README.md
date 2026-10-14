# Spencer Kogoma Portfolio

Static portfolio for FPGA, RTL, and digital hardware work. HTML pages share
`assets/site.css` and `assets/site.js`; no build step is required.

## Local preview

```text
python -m http.server 8000
```

Open http://localhost:8000.

## Assets

The NASA insignia in `assets/nasa.png` is sourced from NASA's official website:
https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo@2x.png
It identifies the NASA Marshall Space Flight Center work location in the Amentum
experience entry. Amentum is the employer.

Project images in `assets/projects/` are original captures extracted from Spencer's
ECE 303 Lab 3 report and exported from the supplied Digital Design Onboarding
Training deck. Captions identify the source page or slide. The two Lab 3 PDFs
contain the same screenshots; images are included once, at their source resolution.
The report also reuses one waveform capture in its RTL and gate-level sections;
the gallery includes it once and identifies that source limitation in its caption.

The MAC page preserves the report's separate DRC and connectivity outcomes:
zero DRC violations and one VSS dangling-wire connectivity violation.

The original 10GbE project URL is retained for existing links. Its page now describes
research exploration of on-chip performance fuzzing and live memory-bank state
relocation, with both directions still being scoped. The original build is paused.
