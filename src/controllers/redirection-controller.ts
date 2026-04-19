import { NextFunction, Request, Response } from "express";

export class RedirectionController {
  redirectWwwwSubdomain(req: Request, res: Response, next: NextFunction) {
    if (req.host !== "www.ankomster.nu") {
      next();
      return;
    }

    res.redirect(301, `https://ankomster.nu${req.originalUrl}`);
  }

  redirectLegacyAirportUrls(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const match = req.path.match(
      /^\/airports\/([A-Z]{3})(?:\/(arrivals|departures))?$/,
    );
    if (!match) {
      next();
      return;
    }

    const [, iataCode, pathDirection] = match;
    const queryDirection = req.query.direction;

    let targetPath: string | null = null;

    if (pathDirection === "arrivals") {
      targetPath = `/airports/${iataCode}`;
    } else if (
      pathDirection === "departures" &&
      queryDirection !== undefined
    ) {
      targetPath = `/airports/${iataCode}/departures`;
    } else if (!pathDirection && queryDirection === "arrivals") {
      targetPath = `/airports/${iataCode}`;
    } else if (!pathDirection && queryDirection === "departures") {
      targetPath = `/airports/${iataCode}/departures`;
    }

    if (!targetPath) {
      next();
      return;
    }

    res.redirect(301, targetPath);
  }
}
