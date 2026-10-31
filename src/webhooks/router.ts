import { Router } from 'express';
import { Webhooks } from '@octokit/webhooks';
import { config } from '../config';
import { handlePullRequest } from './handlers/pull_request';
import { handlePush } from './handlers/push';

const webhooks = new Webhooks({ secret: config.github.webhookSecret });

webhooks.on('pull_request.opened', handlePullRequest);
webhooks.on('pull_request.synchronize', handlePullRequest);
webhooks.on('push', handlePush);

export function createWebhookRouter(): Router {
  const router = Router();
  router.post('/github', async (req, res) => {
    try {
      await webhooks.verifyAndReceive({
        id: req.headers['x-github-delivery'] as string,
        name: req.headers['x-github-event'] as any,
        payload: req.body.toString(),
        signature: req.headers['x-hub-signature-256'] as string,
      });
      res.status(200).send('ok');
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(400).send('Webhook verification failed');
    }
  });
  return router;
}