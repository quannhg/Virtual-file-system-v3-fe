export function normalizePath(path: string) {
  console.log(path);
  if (path === '') return '';
  const subpaths = path.split('/');
  return subpaths.map(normalizeSubpath).join('/');
}

function normalizeSubpath(subpath: string): string {
  const [, group0, group1, group2, group3] =
    subpath.match(/^"([a-zA-Z0-9 _-]+)"|'([a-zA-Z0-9 _-]+)'|([a-zA-Z0-9 _-]+)|(--|\.|\.\.)$/) || [];
  const res = group0 || group1 || group2 || group3;
  if (res === undefined) {
    throw Error('Invalid path');
  }
  return res;
}
