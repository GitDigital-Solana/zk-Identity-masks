import { App } from '@octokit/app';
import { config } from '../config';

export const githubApp = new App({
  appId: config.github.appId,
  privateKey: config.github.privateKey,
  webhooks: { secret: config.github.webhookSecret },
});

export async function getInstallationOctokit(installationId: number) {
  return githubApp.getInstallationOctokit(installationId);
}