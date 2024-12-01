import compression from "compression"
import express from "express"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import {updateSwedaviaFlightsCache} from "./jobs/update-swedavia-flights-cache.js"
import {SqliteSwedaviaFlightsCache} from "./models/sqlite-swedavia-flights-cache.js"
import {AirportController} from "./controllers/airport-controller.js"

const PORT = process.env.PORT || 8080
const refreshIntervalMillis = 60 * 1_000
const app = express()
const swedaviaFlightsCache = new SqliteSwedaviaFlightsCache("swedavia-flights-cache.sqlite3")
const airportController = new AirportController(swedaviaFlightsCache)

app.set('view engine', 'ejs')

app.use(pinoHttp({ logger }))

app.use(compression())

app.get("/", airportController.all)

app.get('/airports/:iataCode', airportController.get);

app.get("/up", (_, res) => {
    res.send("I'm up!")
})

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})

const updateSwedaviaFlightsCachePeriodically = async () => {
    if (swedaviaFlightsCache.isEmptyOrStale(refreshIntervalMillis)) {
        await updateSwedaviaFlightsCache(swedaviaFlightsCache)
    }

    setInterval(async () => {
        await updateSwedaviaFlightsCache(swedaviaFlightsCache)
    }, refreshIntervalMillis)
}

void updateSwedaviaFlightsCachePeriodically()
