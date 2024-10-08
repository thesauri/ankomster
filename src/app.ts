import compression from "compression"
import express from "express"
import { redirectToHttps } from "./middleware/redirectToHttps.js"
import { apiRouter } from "./controllers/api.js"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import { FlightDataCache } from "./services/flightDataCache.js"
import {SwedaviaAirports} from "./services/flightDataCache.interface"

const PORT = process.env.PORT || 8080

const app = express()

const flightDataCache = new FlightDataCache()

app.set('view engine', 'ejs')

app.use(pinoHttp({ logger }))

app.use(compression())

if (process.env.NODE_ENV === "production") {
    app.use(redirectToHttps)
}

app.get("/", (_, res) => {
    res.render("index")
})

app.get('/airports/:iataCode', async (req, res) => {
    try {
        const airportCode = req.params.iataCode.toUpperCase() as SwedaviaAirports;
        const flightData = await flightDataCache.latest;

        const airportData = flightData[airportCode]

        if (airportData === undefined) {
            res.status(404).send(`Invalid airport code: ${airportCode}`)
            return
        }

        res.render('airport', {
            airportCode: airportCode,
            departures: airportData.departures
        });
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use("/api/v1", apiRouter(flightDataCache))

if (process.env.NODE_ENV !== "production") {
    app.use("/mocks", mocksRouter)
}

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`)
})

setInterval(async () => {
    logger.info("Refreshing all flight data...")
    await flightDataCache.refreshAllFlightData()
}, 60 * 1_000)
