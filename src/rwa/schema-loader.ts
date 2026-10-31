import fs from 'fs';
import path from 'path';

export interface RWAMetadata {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  assetClass: string;
  jurisdiction: string;
  attributes?: Record<string, unknown>;
  compliance: { kycRequired: boolean; accreditedOnly: boolean };
}

const SCHEMA_DIR = path.join(__dirname, '../../schemas');

export function loadSchema(name: string): object {
  const fullPath = path.join(SCHEMA_DIR, name);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}