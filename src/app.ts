import compression from "compression"
import express from "express"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import { FlightDataCache } from "./services/flightDataCache.js"
import {SwedaviaAirports} from "./services/flightDataCache.interface"
import {airportsByIataCode} from "./utils/airportsByIataCode.js"
import {z} from "zod"

const PORT = process.env.PORT || 8080

const app = express()

const flightDataCache = new FlightDataCache()

app.set('view engine', 'ejs')

app.use(pinoHttp({ logger }))

app.use(compression())

app.get("/", (req, res) => {
    const { direction } = UrlSearchQuerySchema.parse(req.query)
    const title = getTitleForDirection(direction)
    const airports = Object.entries(airportsByIataCode).map(([airportCode, airportName]) => ({
        href: `/airports/${airportCode}?direction=${direction}`,
        label: airportName
    }))

    res.render("index", {
        airports,
        direction,
        title
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

        const { direction } = UrlSearchQuerySchema.parse(req.query)

        const flights = (direction === "arrivals" ? airportData.arrivals : airportData.departures)
            .filter((departure) => departure.flightLegStatus !== "DEL")
        flights.sort((a, b) =>
            a.timestamp.localeCompare(b.timestamp))

        const homeHref = direction === "arrivals" ? "/?direction=arrivals" : "/?direction=departures"

        const title = getTitleForDirection(direction)
        const switchDirection = direction === "arrivals" ? ({
            label: "Se avgångar",
            href: "?direction=departures"
            }) : ({
            label: "Se ankomster",
            href: "?direction=arrivals"
        })

        res.render('airport', {
            airportCode: airportCode,
            airportName: airportsByIataCode[airportCode],
            homeHref,
            flights,
            title,
            switchDirection
        });
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/up", (_, res) => {
    res.send("I'm up!")
})

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

const UrlSearchQuerySchema = z.object({
    direction: z.enum(["arrivals", "departures"]).default("arrivals")
})

const getTitleForDirection = (direction: "arrivals" | "departures") => {
    switch (direction) {
        case "arrivals":
            return "Ankomster"
        case "departures":
            return "Avgångar"
    }
}
