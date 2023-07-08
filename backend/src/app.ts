import express from "express"
import path from "path"
import { refreshAllFlightData } from "./services/flightData.js"
import { redirectToHttps } from "./middleware/redirectToHttps.js"
import { apiRouter } from "./controllers/api.js"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"

const PORT = process.env.PORT || 8080

const app = express()

app.use(pinoHttp({ logger }))

if (process.env.NODE_ENV === "production") {
    app.use(redirectToHttps)
}

app.use(express.static("public"))

app.use("/api/v1", apiRouter)

if (process.env.NODE_ENV !== "production") {
    app.use("/mocks", mocksRouter)
}

app.get("*", (request, response) => {
    refreshAllFlightData()
    response.sendFile(path.resolve("public", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

console.log("Preloading flight data...")
refreshAllFlightData()

setInterval(() => {
    console.log(`Refreshing all flight data...`)
    refreshAllFlightData()
}, 2 * 60 * 1_000)
