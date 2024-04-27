import { expect, it } from "vitest";
import { parseArgs } from "./parseArgs";

it("should parse arguments correctly", () => {
    expect(parseArgs('-p a/b/c')).toMatchInlineSnapshot(`
      [
        "-p",
        "a/b/c",
      ]
    `);

    expect(parseArgs(`-p "a" "b" "a'" 'b"' "a\\"" 'a\\''`)).toMatchInlineSnapshot(`
      [
        "-p",
        ""a"",
        ""b"",
        ""a'"",
        "'b"'",
        ""a""",
        "'a''",
      ]
    `)

    expect(parseArgs(`a\\ b "a/b"/c`)).toMatchInlineSnapshot(`
      [
        "a b",
        ""a/b"/c",
      ]
    `);

    expect(parseArgs(`"a"b`)).toMatchInlineSnapshot(`
      [
        ""a"b",
      ]
    `)
});