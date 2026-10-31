import express from 'express';
import { createWebhookRouter } from './webhooks/router';
import { config } from './config';

const app = express();
const PORT = config.port;

// Webhook router must receive the raw body for signature verification
app.use('/webhooks', express.raw({ type: 'application/json' }), createWebhookRouter());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Solana RWA Tokenizer listening on port ${PORT}`);
});