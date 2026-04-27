# Runtime Smoke Results

**Created**: 2026-04-27
**Last Updated**: 2026-04-27
**Category**: [OPERATIONS]
**Timeline**: 02 of 99 - Local runtime validation

## Overview

The local development stack was validated in Cursor Cloud with CDS, approuter, and portal running simultaneously.

## Commands

- `npx cds-typer srv --outputDirectory @cds-models --targetModuleType esm`
- `ASPIRE_LOCAL_ONLY=1 SKIP_BIND=1 npm run serve:cds:local`
- `ASPIRE_LOCAL_ONLY=1 SKIP_BIND=1 npm run serve:approuter:local`
- `CDS_URL=http://localhost:4004 npm run dev` from `app/portal`

## Results

- CDS served `http://localhost:4004` after typed model generation.
- Approuter served `http://localhost:9000/health` and API docs.
- Portal served `http://localhost:3000/portal` and connected to CDS SSE.
- `npm test` is not a local-only smoke test as currently written; it requires IAS binding and references `@jest/globals`.

## Artifact

- `/opt/cursor/artifacts/local_dev_environment_walkthrough.mp4`
