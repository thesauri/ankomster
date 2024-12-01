import {Flight, SqliteSwedaviaFlightsCache} from "../models/sqlite-swedavia-flights-cache.js"
import {logger} from "../utils/logger.js"
import {SwedaviaFlightsClient} from "../services/swedavia-flights-client.js"
import {ArrivingFlight, DepartingFlight, SwedaviaResponse} from "../services/swedavia-flights-client.interface.js"

export const updateSwedaviaFlightsCache = async (
    swedaviaFlightsCache: SqliteSwedaviaFlightsCache
) => {
    const airports = ["ARN", "GOT", "BMA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"]
    const directions = ["arrivals", "departures"] as const
    const dates = [dateTodayYYYYMMDD(), dateTomorrowYYYYMMDD()]

    logger.info({
        airports,
        directions,
        dates,
    }, "Updating cache for all airports")

    for (const airport of airports) {
        for (const direction of directions) {
            for (const date of dates) {
                try {
                    logger.info({ airport, direction, date }, `Updating cache for ${airport} ${direction} on ${date}`)
                    const rawFlightData = await SwedaviaFlightsClient.get(airport, direction, date)
                    const flights = mapSwedaviaResponseToFlights(rawFlightData)
                    swedaviaFlightsCache.upsert(airport, date, direction, flights, rawFlightData)
                    logger.info({ airport, direction, date, n: rawFlightData.flights.length }, `Cache updated for ${airport} ${direction} on ${date} (${rawFlightData.flights.length} flights)`)
                } catch (err) {
                    logger.error({ airport, direction, date, err }, `Failed to update cache for ${airport} ${direction} on ${date}`)
                }
            }
        }
    }

    logger.info({
        airports,
        directions,
        dates,
    }, "Cache updated for all airports")
}

const dateTodayYYYYMMDD = () => new Date().toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().substring(0, 10)
}

const mapSwedaviaResponseToFlights = (
    swedaviaResponse: SwedaviaResponse
): Flight[] => {
    if ("to" in swedaviaResponse) {
        return mapSwedaviaArrivalsToFlights(swedaviaResponse.flights)
    }
    return mapSwedaviaDeparturesToFlights(swedaviaResponse.flights)
}

const mapSwedaviaArrivalsToFlights = (
    arrivingFlights: ArrivingFlight[]
): Flight[] => {
    const flights: Flight[] = []

    for (const flight of arrivingFlights) {
        if (flight.arrivalTime === undefined ||
            flight.arrivalTime.scheduledUtc === undefined ||
            flight.departureAirportSwedish === undefined ||
            flight.flightId === undefined ||
            flight.remarksSwedish === undefined ||
            flight.locationAndStatus === undefined ||
            flight.locationAndStatus.flightLegStatus === undefined
        ) {
            continue
        }
        flights.push({
            timestamp: flight.arrivalTime.scheduledUtc,
            airport: flight.departureAirportSwedish,
            flightNumber: flight.flightId,
            remarks: flight.remarksSwedish[0]?.text,
            flightLegStatus: flight.locationAndStatus.flightLegStatus
        })
    }

    return flights
}


const mapSwedaviaDeparturesToFlights = (
    departingFlights: DepartingFlight[]
): Flight[] => {
    const flights: Flight[] = []

    for (const flight of departingFlights) {
        if (flight.departureTime === undefined ||
            flight.departureTime.scheduledUtc === undefined ||
            flight.arrivalAirportSwedish === undefined ||
            flight.flightId === undefined ||
            flight.remarksSwedish === undefined ||
            flight.locationAndStatus === undefined ||
            flight.locationAndStatus.flightLegStatus === undefined
        ) {
            continue
        }
        flights.push({
            timestamp: flight.departureTime.scheduledUtc,
            airport: flight.arrivalAirportSwedish,
            flightNumber: flight.flightId,
            remarks: flight.remarksSwedish[0]?.text,
            flightLegStatus: flight.locationAndStatus.flightLegStatus
        })
    }

    return flights
}
