import compression from "compression"
import express from "express"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import { FlightDataCache } from "./services/flightDataCache.js"
import {SwedaviaAirports} from "./services/flightDataCache.interface"
import {airports} from "./utils/airports.js"

const PORT = process.env.PORT || 8080

const app = express()

const flightDataCache = new FlightDataCache()

app.set('view engine', 'ejs')

app.use(pinoHttp({ logger }))

app.use(compression())

app.get("/", (_, res) => {
    res.render("index", {
        airports: Object.entries(airports)
    })
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

        const departuresByTimestamp =
            airportData.departures
        departuresByTimestamp.sort((a, b) =>
            a.timestamp.localeCompare(b.timestamp))

        res.render('airport', {
            airportCode: airportCode,
            airportName: airports[airportCode],
            departures: airportData.departures
        });
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).send('Internal Server Error');
    }
});

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
