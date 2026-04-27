# Initial Setup Findings

**Created**: 2026-04-27
**Last Updated**: 2026-04-27
**Category**: [OPERATIONS]
**Timeline**: 00 of 99 - Initial environment discovery

## Overview

The repository uses npm with a root `package-lock.json`. The root project defines workspaces for `app/router` and `tools/ias-token-cli`, while `app/portal` has a separate `package.json` and dependency tree.

## Findings

- Root install command: `npm install`.
- Portal install command: `npm install --prefix app/portal`.
- Local backend command: `npm run serve:cds:local`.
- Local approuter command: `npm run serve:approuter:local`.
- Expected backend URL: `http://localhost:4004`.
- Expected approuter URL: `http://localhost:9000`.
- Fully local mode should use `ASPIRE_LOCAL_ONLY=1` and `SKIP_BIND=1` when using Aspire.

## References

- `AGENTS.md`
- `package.json`
- `app/portal/package.json`
