import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  createInitializeMetadataPointerInstruction,
  createInitializeInstruction,
  pack,
} from '@solana/spl-token';
import { config } from '../config';
import { RWAMetadata } from './schema-loader';

export async function tokenizeAsset(
  payer: Keypair,
  metadata: RWAMetadata
): Promise<{ mint: PublicKey; signature: string }> {
  const connection = new Connection(config.solana.rpcUrl, 'confirmed');
  const mintKeypair = Keypair.generate();
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      payer.publicKey,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      metadata.decimals,
      payer.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      metadata: mintKeypair.publicKey,
      updateAuthority: payer.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: payer.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      additionalMetadata: Object.entries(metadata.attributes || {}).map(([k, v]) => [k, String(v)]),
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);
  return { mint: mintKeypair.publicKey, signature };
}