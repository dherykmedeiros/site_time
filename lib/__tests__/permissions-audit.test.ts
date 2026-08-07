import { describe, it, expect } from "vitest";
import { hasPermission, hasAnyPermission } from "../permissions";
import { maskCpf } from "../utils";

describe("RBAC Permissions Engine", () => {
  it("should grant full permissions to ADMIN role", () => {
    expect(hasPermission("ADMIN", "team:manage")).toBe(true);
    expect(hasPermission("ADMIN", "finance:manage")).toBe(true);
    expect(hasPermission("ADMIN", "match:create")).toBe(true);
    expect(hasPermission("ADMIN", "player:create")).toBe(true);
  });

  it("should restrict financial management for PLAYER role", () => {
    expect(hasPermission("PLAYER", "finance:manage")).toBe(false);
    expect(hasPermission("PLAYER", "team:manage")).toBe(false);
  });

  it("should allow COACH to manage tactical plays and match reports", () => {
    expect(hasPermission("COACH", "tactical:view")).toBe(true);
    expect(hasPermission("COACH", "match:view")).toBe(true);
    expect(hasPermission("COACH", "finance:manage")).toBe(false);
  });

  it("should support hasAnyPermission check", () => {
    expect(hasAnyPermission("PLAYER", ["finance:manage", "match:view"])).toBe(true);
    expect(hasAnyPermission("PLAYER", ["finance:manage", "team:manage"])).toBe(false);
  });
});

describe("LGPD Masking Utilities", () => {
  it("should mask middle 6 digits of a standard CPF string", () => {
    expect(maskCpf("60836475330")).toBe("***.***.753-30");
    expect(maskCpf("070.124.873-48")).toBe("***.***.873-48");
  });

  it("should handle null or empty values gracefully", () => {
    expect(maskCpf(null)).toBe("");
    expect(maskCpf(undefined)).toBe("");
    expect(maskCpf("")).toBe("");
  });
});
