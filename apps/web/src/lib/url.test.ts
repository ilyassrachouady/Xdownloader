import { describe, expect, it } from "vitest";
import { validateTwitterUrl, parseStatusPath } from "./url";

describe("validateTwitterUrl", () => {
  it("accepts x.com status URLs", () => {
    const result = validateTwitterUrl("https://x.com/user/status/123456789");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tweetId).toBe("123456789");
    }
  });

  it("accepts twitter.com and www hosts", () => {
    expect(validateTwitterUrl("https://twitter.com/a/status/1").ok).toBe(true);
    expect(validateTwitterUrl("https://www.twitter.com/a/status/1").ok).toBe(true);
    expect(validateTwitterUrl("https://www.x.com/a/status/1").ok).toBe(true);
    expect(validateTwitterUrl("https://mobile.twitter.com/a/status/1").ok).toBe(true);
  });

  it("accepts replace-domain magic links with /status/", () => {
    const result = validateTwitterUrl("https://localhost:3000/user/status/999");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.tweetId).toBe("999");
      expect(result.normalized).toBe("https://x.com/i/status/999");
    }
  });

  it("rejects paths without /status/", () => {
    const result = validateTwitterUrl("https://x.com/username");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("invalid_path");
  });

  it("rejects unrelated domains that are not status paths", () => {
    const result = validateTwitterUrl("https://example.com/about");
    expect(result.ok).toBe(false);
  });
});

describe("parseStatusPath", () => {
  it("parses username and i/status paths", () => {
    expect(parseStatusPath("/kasmiyouness1/status/2101437295182147893")).toBe(
      "2101437295182147893",
    );
    expect(parseStatusPath("/i/status/123")).toBe("123");
    expect(parseStatusPath("/i/web/status/123")).toBe("123");
  });
});
