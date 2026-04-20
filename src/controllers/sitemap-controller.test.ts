import { Request, Response } from "express";
import { describe, test, expect, vi } from "vitest";
import { SitemapController } from "./sitemap-controller.js";
import { SwedaviaAirports } from "../services/swedavia-airports.js";

describe("SitemapController", () => {
  const render = (): { body: string; headers: Record<string, string> } => {
    const controller = new SitemapController();
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

  test("returns XML with application/xml content type", () => {
    const { body, headers } = render();
    expect(headers["Content-Type"]).toBe("application/xml");
    expect(body).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(body).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
    expect(body).toContain("</urlset>");
  });

  test("includes home page in both directions", () => {
    const { body } = render();
    expect(body).toContain("<loc>https://ankomster.nu/</loc>");
    expect(body).toContain(
      "<loc>https://ankomster.nu/?direction=departures</loc>",
    );
  });

  test("includes each airport in both directions", () => {
    const { body } = render();
    for (const { iataCode } of SwedaviaAirports.getAllAirports()) {
      expect(body).toContain(
        `<loc>https://ankomster.nu/airports/${iataCode}</loc>`,
      );
      expect(body).toContain(
        `<loc>https://ankomster.nu/airports/${iataCode}/departures</loc>`,
      );
    }
  });

  test("lists one URL per airport per direction plus two home URLs", () => {
    const { body } = render();
    const count = (body.match(/<loc>/g) ?? []).length;
    const airportCount = SwedaviaAirports.getAllAirports().length;
    expect(count).toBe(2 + airportCount * 2);
  });
});
