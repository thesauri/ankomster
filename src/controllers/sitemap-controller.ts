import { Request, Response } from "express";
import { SwedaviaAirports } from "../services/swedavia-airports.js";

const BASE_URL = "https://ankomster.nu";

export class SitemapController {
  get = (_req: Request, res: Response): void => {
    const urls = [
      `${BASE_URL}/`,
      `${BASE_URL}/?direction=departures`,
      ...SwedaviaAirports.getAllAirports().flatMap(({ iataCode }) => [
        `${BASE_URL}/airports/${iataCode}`,
        `${BASE_URL}/airports/${iataCode}/departures`,
      ]),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
      "</urlset>",
    ].join("\n");

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(xml);
  };
}
