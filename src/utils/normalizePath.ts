export function normalizePath(path: string) {
  let isAbs = false;
  if (path.startsWith('/')) {
    isAbs = true;
    path = path.slice(1);
  }
  if (path === '') return isAbs ? '/' : '';
  const subpaths = path.split('/');
  return (isAbs ? '/' : '') + subpaths.map(normalizeSubpath).join('/');
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
