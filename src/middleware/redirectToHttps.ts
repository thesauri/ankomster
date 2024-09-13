import { NextFunction, Request, Response } from "express"

export const redirectToHttps = (request: Request, response: Response, next: NextFunction) => {
    if (request.headers["x-forwarded-proto"] === "http") {
        response.redirect(`https://${request.hostname}${request.url}`)    
    } else {
        next()
    }
}
