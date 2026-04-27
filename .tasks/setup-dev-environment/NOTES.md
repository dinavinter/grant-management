# Development Environment Setup Notes

**Created**: 2026-04-27
**Last Updated**: 2026-04-27
**Category**: [OPERATIONS]

## Notes

- Root package manager is npm, with `package-lock.json` present.
- Root workspaces include `app/router` and `tools/ias-token-cli`.
- `app/portal` has a separate `package.json` and is not listed in root workspaces.
- Fully local app mode uses mocked auth for CDS and local no-auth router config.
- Generate typed CDS models with `npx cds-typer srv --outputDirectory @cds-models --targetModuleType esm` before running CDS if `@cds-models` is absent.
- `npm run compile:ts` did not complete in this environment, and `npx cds compile srv --to ts` reported that the `ts` model processor was unavailable.
- `npm test` currently expects IAS bindings and also imports `@jest/globals`, so it is not a local no-IAS smoke check.
