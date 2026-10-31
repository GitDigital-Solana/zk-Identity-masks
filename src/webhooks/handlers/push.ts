export async function handlePush(payload: any): Promise<void> {
  const { ref, repository, commits, installation } = payload;
  if (!installation) return;

  const branch = ref.replace('refs/heads/', '');
  console.log(`Push to ${repository.full_name} on ${branch}: ${commits.length} commit(s)`);

  // Future: sync registry or trigger re-validation on push to main
  if (branch === 'main') {
    console.log('Main branch push – registry sync hook point');
  }
}