import { getInstallationOctokit } from '../github/client';
import { createOrUpdateFile } from '../github/file-service';
import { config } from '../config';
import { RWAMetadata } from './schema-loader';

export interface RegistryEntry {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  assetClass: string;
  jurisdiction: string;
  compliance: { kycRequired: boolean; accreditedOnly: boolean };
  timestamp: string;
}

export async function writeRegistryEntry(
  installationId: number,
  entry: RegistryEntry
): Promise<void> {
  const path = `registry/${entry.mint}.json`;
  await createOrUpdateFile(
    installationId,
    config.registry.owner,
    config.registry.repo,
    path,
    JSON.stringify(entry, null, 2),
    `chore: register RWA token ${entry.symbol} (${entry.mint})`,
    config.registry.branch
  );
}