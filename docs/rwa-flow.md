# RWA Tokenization Flow

## Trigger: Pull Request
1. Contributor opens a PR containing a `token-metadata.json` file.
2. GitHub sends a `pull_request.opened` webhook.
3. The backend:
   - Verifies the webhook signature.
   - Reads the metadata file at the PR head SHA.
   - Validates against `schemas/rwa.schema.json`.
   - If valid, mints a Token-2022 token with metadata on Solana.
   - Comments on the PR with the mint address and transaction signature.
   - Optionally writes a registry entry to the registry repo.

## Trigger: Push
1. A push to `main` triggers registry synchronization (future extension).