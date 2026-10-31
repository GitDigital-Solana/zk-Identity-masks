import { describe, it, expect } from 'vitest';
import { validateMetadata, parseRWAMetadata } from '../src/rwa/metadata-validator';

const validMetadata = {
  name: 'Test Token',
  symbol: 'TST',
  uri: 'https://example.com/meta.json',
  decimals: 6,
  assetClass: 'commodity',
  jurisdiction: 'US',
  compliance: { kycRequired: true, accreditedOnly: false },
};

describe('validateMetadata', () => {
  it('accepts valid metadata', () => {
    const result = validateMetadata(validMetadata);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects missing required fields', () => {
    const result = validateMetadata({ name: 'Only Name' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid decimals', () => {
    const result = validateMetadata({ ...validMetadata, decimals: 12 });
    expect(result.valid).toBe(false);
  });
});

describe('parseRWAMetadata', () => {
  it('parses valid JSON', () => {
    expect(parseRWAMetadata(JSON.stringify(validMetadata))).toEqual(validMetadata);
  });

  it('throws on invalid metadata', () => {
    expect(() => parseRWAMetadata('{"name":"x"}')).toThrow();
  });
});