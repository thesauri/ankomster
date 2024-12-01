import {SwedaviaAirports, SwedaviaAirportsSchema} from "../services/swedavia-airports.js"
import {z} from "zod"
import {Request, Response} from "express"
import {SqliteSwedaviaFlightsCache} from "../models/sqlite-swedavia-flights-cache.js"

export class AirportController {
    private swedaviaFlightsCache: SqliteSwedaviaFlightsCache;

    constructor(swedaviaFlightsCache: SqliteSwedaviaFlightsCache) {
        this.swedaviaFlightsCache = swedaviaFlightsCache;
        this.all = this.all.bind(this);
        this.get = this.get.bind(this);
    }

    all(req: Request, res: Response): void {
        const { direction } = z.object({ direction: DirectionSchema }).parse(req.query)
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
    }

    async get(req: Request, res: Response) {
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

            const { direction, filter } = z.object({
                direction: DirectionSchema,
                filter: z.enum(["all"]).optional()
            }).parse(req.query)

            const { flights: flightsToday } = this.swedaviaFlightsCache.get(iataCode, currentDateInSweden, direction)
            const { flights: flightsTomorrow } = this.swedaviaFlightsCache.get(iataCode, tomorrowsDateInSweden, direction)

            const oneHourAgo = new Date().getTime() - 60 * 60 * 1_000
            const cutOffTime = filter === "all" ? 0 : new Date().getTime() - 60 * 60 * 1_000
            const flights = [...flightsToday, ...flightsTomorrow]
                .filter((departure) => departure.flightLegStatus !== "DEL" &&
                    new Date(departure.timestamp).getTime() > cutOffTime
                 )
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
            const oldFlights = filter !== "all" ? ({
                href: `?direction=${direction}&filter=all`,
            }) : undefined

            res.render('airport', {
                airportCode: params,
                airportName: SwedaviaAirports.getName(iataCode),
                homeHref,
                flights,
                title,
                switchDirection,
                oldFlights
            });
        } catch (error) {
            console.error('Error fetching flight data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

const DirectionSchema = z.enum(["arrivals", "departures"]).default("arrivals")

const getTitleForDirection = (direction: "arrivals" | "departures") => {
    switch (direction) {
    case "arrivals":
        return "Ankomster"
    case "departures":
        return "Avgångar"
    }
}
