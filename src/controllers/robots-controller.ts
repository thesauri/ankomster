import { Request, Response } from "express";

const BODY = `User-agent: *
Allow: /

Sitemap: https://ankomster.nu/sitemap.xml
`;

export class RobotsController {
  get = (_req: Request, res: Response): void => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(BODY);
  };
}
