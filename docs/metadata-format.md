# Metadata Format

RWA token metadata must conform to `schemas/rwa.schema.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Token name (max 32 chars) |
| `symbol` | string | Yes | Token symbol (max 10 chars) |
| `uri` | string (URI) | Yes | Off-chain metadata URI |
| `decimals` | integer (0–9) | Yes | Token decimals |
| `assetClass` | enum | Yes | RWA category |
| `jurisdiction` | string | Yes | ISO jurisdiction code |
| `attributes` | object | No | Free-form attributes |
| `compliance` | object | Yes | KYC/accredited flags |

See `templates/token-metadata.json` for a complete example.