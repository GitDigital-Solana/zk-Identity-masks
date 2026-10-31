import { describe, it, expect } from 'vitest';
import { tokenizeAsset } from '../src/rwa/tokenizer';
import { Keypair } from '@solana/web3.js';

// These tests require a funded devnet payer key.
// Set SOLANA_PAYER_PRIVATE_KEY in .env and remove `.skip` to run.
describe.skip('tokenizeAsset (integration)', () => {
  it('mints a Token-2022 token with metadata', async () => {
    const payer = Keypair.generate(); // Replace with a funded keypair for real runs
    const { mint, signature } = await tokenizeAsset(payer, {
      name: 'Integration Test Token',
      symbol: 'ITT',
      uri: 'https://example.com/itt.json',
      decimals: 6,
      assetClass: 'fund',
      jurisdiction: 'US',
      compliance: { kycRequired: true, accreditedOnly: false },
    });
    expect(mint.toBase58()).toBeTruthy();
    expect(signature).toBeTruthy();
  }, 60_000);
});