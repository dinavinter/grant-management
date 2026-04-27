# Aspire Host Results

**Created**: 2026-04-27
**Last Updated**: 2026-04-27
**Category**: [OPERATIONS] [ASPIRE]
**Timeline**: 03 of 99 - Aspire host validation

## Overview

The local stack was run through the configured Aspire TypeScript AppHost with CDS, approuter, and portal resources enabled.

## Commands

- `curl -sSL https://aspire.dev/install.sh -o /tmp/aspire-install.sh`
- `/tmp/aspire-install.sh --install-path "$HOME/.aspire/bin"`
- `npm run aspire:build`
- `ASPIRE_LOCAL_ONLY=1 SKIP_BIND=1 ASPIRE_ENABLE_PORTAL=1 aspire run --detach --format Json`
- `aspire ps --format Json --resources`

## Results

- Aspire dashboard started at `https://localhost:15469`.
- Aspire reported `cds`, `approuter`, and `portal` resources as `Running` and `Healthy`.
- CDS responded at `http://localhost:4004/`.
- Approuter responded at `http://localhost:9000/health` and `http://localhost:9000/api-docs`.
- Portal responded at `http://localhost:3000/portal`.

## Artifact

- `/opt/cursor/artifacts/aspire_host_local_stack_walkthrough.mp4`

## Notes

- The AppHost needed fixed-port local wiring and documented feature-flag handling instead of unsupported `withReference` calls on executable resources.
