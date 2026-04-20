import { Request, Response } from "express";
import { describe, test, expect, vi } from "vitest";
import { RobotsController } from "./robots-controller.js";

describe("RobotsController", () => {
  const render = (): { body: string; headers: Record<string, string> } => {
    const controller = new RobotsController();
    const headers: Record<string, string> = {};
    let body = "";
    const response = {
      setHeader: vi.fn((name: string, value: string) => {
        headers[name] = value;
      }),
      send: vi.fn((payload: string) => {
        body = payload;
      }),
    } as unknown as Response;
    controller.get({} as Request, response);
    return { body, headers };
  };

  test("serves text/plain", () => {
    const { headers } = render();
    expect(headers["Content-Type"]).toBe("text/plain");
  });

  test("allows all crawlers", () => {
    const { body } = render();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
  });

  test("points to the sitemap", () => {
    const { body } = render();
    expect(body).toContain("Sitemap: https://ankomster.nu/sitemap.xml");
  });
});
