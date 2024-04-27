import { expect, it } from 'vitest';
import { normalizePath } from '../src/utils/normalizePath';

it('should normalize path correctly', () => {
  expect(normalizePath('a/b/c/d')).toMatchInlineSnapshot(`"a/b/c/d"`);
  expect(normalizePath(`"a"/'b'/"c"/"d   "`)).toMatchInlineSnapshot(`"a/b/c/d   "`);
  expect(() => normalizePath(`"a/b"/c`)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Invalid path]`
  );
});
