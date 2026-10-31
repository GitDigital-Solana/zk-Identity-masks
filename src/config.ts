import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  github: {
    appId: process.env.GITHUB_APP_ID || '',
    privateKey: (process.env.GITHUB_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  },
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    payerPrivateKey: process.env.SOLANA_PAYER_PRIVATE_KEY || '',
  },
  registry: {
    owner: process.env.REGISTRY_OWNER || '',
    repo: process.env.REGISTRY_REPO || 'rwa-registry',
    branch: process.env.REGISTRY_BRANCH || 'main',
  },
} as const;