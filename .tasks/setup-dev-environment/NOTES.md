# Development Environment Setup Notes

**Created**: 2026-04-27
**Last Updated**: 2026-04-27
**Category**: [OPERATIONS]

## Notes

- Root package manager is npm, with `package-lock.json` present.
- Root workspaces include `app/router` and `tools/ias-token-cli`.
- `app/portal` has a separate `package.json` and is not listed in root workspaces.
- Fully local app mode uses mocked auth for CDS and local no-auth router config.
