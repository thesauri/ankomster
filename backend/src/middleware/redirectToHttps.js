export const redirectToHttps = (request, response, next) => {
    if (request.headers["x-forwarded-proto"] === "http") {
        response.redirect(`https://${request.hostname}${request.url}`)    
    } else {
        next()
    }
}
