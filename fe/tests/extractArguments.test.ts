import { expect, it } from 'vitest';
import { extractArguments } from '../src/utils/extractArguments';

it('should parse arguments correctly', () => {
  expect(extractArguments('-p a/b/c')).toMatchInlineSnapshot(`
      [
        "-p",
        "a/b/c",
      ]
    `);

  expect(extractArguments(`-p "a" "b" "a'" 'b"' "a\\"" 'a\\''`)).toMatchInlineSnapshot(`
      [
        "-p",
        ""a"",
        ""b"",
        ""a'"",
        "'b"'",
        ""a""",
        "'a''",
      ]
    `);

  expect(extractArguments(`a\\ b "a/b"/c`)).toMatchInlineSnapshot(`
      [
        "a b",
        ""a/b"/c",
      ]
    `);

  expect(extractArguments(`"a"b`)).toMatchInlineSnapshot(`
      [
        ""a"b",
      ]
    `);
});
