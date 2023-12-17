import { describe, expect, test } from "vitest";

describe("true or false", () => {
  test("true is true", () => {
    expect(true).toBe(true);
  });

  test("false is false", () => {
    expect(false).toBe(false);
  });
});
