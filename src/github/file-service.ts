import { getInstallationOctokit } from './client';

export async function getFileContent(
  installationId: number,
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<string | null> {
  const octokit = await getInstallationOctokit(installationId);
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref });
    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function createOrUpdateFile(
  installationId: number,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string
) {
  const octokit = await getInstallationOctokit(installationId);
  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
    if ('sha' in data) sha = data.sha;
  } catch (err: any) {
    if (err.status !== 404) throw err;
  }
  return octokit.rest.repos.createOrUpdateFileContents({
    owner, repo, path, message, content: Buffer.from(content).toString('base64'), branch, sha,
  });
}