# FEATURE 9: Architecture Diagram Generator

## Purpose
Visualize architecture.

## Generate
- **System Diagram**: Frontend -> Backend -> Database
- **Module Diagram**: Auth -> Users -> Payments

## API
- `POST /diagram/generate`

## Current Status
**Partially Implemented**: Present in `backend/src/diagram` and `frontend/app/diagram`.

---

## Developer TODO List
- [ ] Generate mermaid or other flowchart syntax.
- [ ] Display generated diagram in frontend.
