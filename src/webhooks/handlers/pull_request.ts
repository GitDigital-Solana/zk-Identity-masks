import { getFileContent } from '../../github/file-service';
import { commentOnPullRequest } from '../../github/pr-service';
import { parseRWAMetadata } from '../../rwa/metadata-validator';
import { tokenizeAsset } from '../../rwa/tokenizer';
import { Keypair } from '@solana/web3.js';
import { config } from '../../config';

export async function handlePullRequest(payload: any): Promise<void> {
  const { installation, repository, pull_request } = payload;
  if (!installation) return;

  const owner = repository.owner.login;
  const repo = repository.name;
  const pullNumber = pull_request.number;

  // Look for a metadata file changed in the PR
  const files = await getChangedFiles(installation.id, owner, repo, pullNumber);
  const metadataFile = files.find((f: string) => f.endsWith('token-metadata.json'));
  if (!metadataFile) return;

  const raw = await getFileContent(installation.id, owner, repo, metadataFile, pull_request.head.sha);
  if (!raw) {
    await commentOnPullRequest(installation.id, owner, repo, pullNumber, '❌ Could not read metadata file.');
    return;
  }

  try {
    const metadata = parseRWAMetadata(raw);
    const payer = Keypair.fromSecretKey(Buffer.from(config.solana.payerPrivateKey, 'base64'));
    const { mint, signature } = await tokenizeAsset(payer, metadata);
    await commentOnPullRequest(
      installation.id, owner, repo, pullNumber,
      `✅ Tokenized **${metadata.name}** (${metadata.symbol})\nMint: \`${mint.toBase58()}\`\nTx: \`${signature}\``
    );
  } catch (err: any) {
    await commentOnPullRequest(installation.id, owner, repo, pullNumber, `❌ Validation failed: ${err.message}`);
  }
}

async function getChangedFiles(installationId: number, owner: string, repo: string, pullNumber: number): Promise<string[]> {
  const { getInstallationOctokit } = await import('../../github/client');
  const octokit = await getInstallationOctokit(installationId);
  const { data } = await octokit.rest.pulls.listFiles({ owner, repo, pull_number: pullNumber });
  return data.map((f: any) => f.filename);
}