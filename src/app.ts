import compression from "compression"
import express from "express"
import { mocksRouter } from "./controllers/mocks.js"
import pinoHttp from "pino-http"
import { logger } from "./utils/logger.js"
import {z} from "zod"
import {updateSwedaviaFlightsCache} from "./jobs/update-swedavia-flights-cache.js"
import {SqliteSwedaviaFlightsCache} from "./models/sqlite-swedavia-flights-cache.js"
import {SwedaviaAirports, SwedaviaAirportsSchema} from "./services/swedavia-airports.js"

const PORT = process.env.PORT || 8080
const app = express()
const swedaviaFlightsCache = new SqliteSwedaviaFlightsCache("swedavia-flights-cache.sqlite3")

app.set('view engine', 'ejs')

app.use(pinoHttp({ logger }))

app.use(compression())

app.get("/", (req, res) => {
    const { direction } = UrlSearchQuerySchema.parse(req.query)
    const title = getTitleForDirection(direction)
    const airports = SwedaviaAirports.getAllAirports().map(({ iataCode, name }) => ({
        href: `/airports/${iataCode}?direction=${direction}`,
        label: name
    }))

    res.render("index", {
        airports,
        direction,
        title
    })
})

app.get('/airports/:iataCode', async (req, res) => {
    try {
        const params = z.object({
            iataCode: SwedaviaAirportsSchema
        }).safeParse(req.params)

        if (!params.success) {
            res.status(404).send('Not Found');
            return;
        }

        const { iataCode: iataCode } = params.data

        const currentDateInSweden = new Date().toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).substring(0, 10)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowsDateInSweden = tomorrow.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" }).substring(0, 10)

        const { direction } = UrlSearchQuerySchema.parse(req.query)

        const { flights: flightsToday } = swedaviaFlightsCache.get(iataCode, currentDateInSweden, direction)
        const { flights: flightsTomorrow } = swedaviaFlightsCache.get(iataCode, tomorrowsDateInSweden, direction)

        const flights = [...flightsToday, ...flightsTomorrow]
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
            airportCode: params,
            airportName: SwedaviaAirports.getName(iataCode),
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

const updateSwedaviaFlightsCachePeriodically = async () => {
    await updateSwedaviaFlightsCache(swedaviaFlightsCache)

    setInterval(async () => {
        await updateSwedaviaFlightsCache(swedaviaFlightsCache)
    }, 60 * 1_000)
}

void updateSwedaviaFlightsCachePeriodically()

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
