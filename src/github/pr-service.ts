import { getInstallationOctokit } from './client';
import { config } from '../config';

export async function commentOnPullRequest(
  installationId: number,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string
) {
  const octokit = await getInstallationOctokit(installationId);
  return octokit.rest.issues.createComment({ owner, repo, issue_number: pullNumber, body });
}

export async function updatePullRequestLabel(
  installationId: number,
  owner: string,
  repo: string,
  pullNumber: number,
  labels: string[]
) {
  const octokit = await getInstallationOctokit(installationId);
  return octokit.rest.issues.setLabels({ owner, repo, issue_number: pullNumber, labels });
}

export async function createRegistryPullRequest(
  installationId: number,
  owner: string,
  repo: string,
  title: string,
  head: string,
  base: string,
  body: string
) {
  const octokit = await getInstallationOctokit(installationId);
  return octokit.rest.pulls.create({ owner, repo, title, head, base, body });
}