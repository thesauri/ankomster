import { NextFunction, Request, Response } from "express";

export class RedirectionController {
  redirectWwwwSubdomain(req: Request, res: Response, next: NextFunction) {
    if (req.host !== "www.ankomster.nu") {
      next();
      return;
    }

    res.redirect(301, `https://ankomster.nu${req.originalUrl}`);
  }
}
