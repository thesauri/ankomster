import { Request, Response } from "express";

export class ErrorController {
  status404NotFound(_: Request, res: Response): void {
    res.status(404).render("404");
  }
}
