# Resume Studio — Project Brief

Greenfield web resume builder: structured editor, live preview in one fixed template, PDF export.

## MVP (Phase 0–1)

- One template (`default-v1`)
- JSON resume data (no user HTML)
- Live preview = same components as print
- `localStorage` persistence (Phase 1)
- Browser print → PDF

## Out of scope (v1)

- Multiple templates, AI, ATS, accounts, cloud save, DOCX

## Implementation phases

| Phase | Focus |
|-------|--------|
| 0 | Schema, sample data, template renderer, `/preview` |
| 1 | Editor, Zustand persist, validation, export |
| 2+ | Auth, PostgreSQL, server PDF (Playwright) |

See full stakeholder brief in project planning docs.
