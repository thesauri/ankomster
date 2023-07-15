import express from "express"
import path from "path"
import { redirectToHttps } from "./middleware/redirectToHttps.js"
import { apiRouter } from "./controllers/api.js"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import { FlightData } from "./services/flightData.js"

const PORT = process.env.PORT || 8080

const app = express()

const flightData = new FlightData()

app.use(pinoHttp({ logger }))

if (process.env.NODE_ENV === "production") {
    app.use(redirectToHttps)
}

app.use(express.static("public"))

app.use("/api/v1", apiRouter(flightData))

if (process.env.NODE_ENV !== "production") {
    app.use("/mocks", mocksRouter)
}

app.get("*", (request, response) => {
    response.sendFile(path.resolve("public", "index.html"))
})

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})

setInterval(async () => {
    logger.info("Refreshing all flight data...")
    await flightData.refreshAllFlightData()
}, 60 * 1_000)
