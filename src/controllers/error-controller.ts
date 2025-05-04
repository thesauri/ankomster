import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export class ErrorController {
  status404NotFound(_: Request, res: Response): void {
    res.status(404).render("404");
  }
  status500InternalServerError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    logger.error(
      {
        err,
        req,
        res,
        next,
      },
      `An unexpected error occurred: ${err.message}`,
    );
    res.status(500).render("500");
  }
}
