# Architecture

## Overview
The Solana RWA Tokenizer is a Node.js (TypeScript) backend that bridges GitHub and Solana. It listens for GitHub webhook events (pull requests and pushes) and orchestrates RWA tokenization on Solana.

## Components
1. **Webhook Router** – Verifies GitHub HMAC signatures using `@octokit/webhooks` and dispatches to handlers.
2. **GitHub Client** – Authenticates as a GitHub App via `@octokit/app` and provides PR/file services.
3. **RWA Core** – Validates metadata against JSON schemas (AJV) and mints Token-2022 tokens with the Metadata extension using `@solana/spl-token`.
4. **Registry Writer** – Persists minted token metadata to a separate registry repository.

## Security
- Webhook signature verification is mandatory (`x-hub-signature-256`).
- Metadata is validated before any on-chain action.
- Payer keys are loaded from environment variables, never committed.