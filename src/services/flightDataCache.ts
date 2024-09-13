import { logger } from "../utils/logger.js"
import { SwedaviaResponse } from "../utils/swedavia.interface.js"
import { fetchFlights } from "../utils/swedavia.js"
import {
    AirportFlights,
    Flight,
    FlightData,
} from "./flightDataCache.interface.js"

export class FlightDataCache {
    private _latest: Promise<FlightData> = getLatestFlightData()

    constructor() {}

    get latest(): Promise<FlightData> {
        return this._latest
    }

    set latest(input: Promise<FlightData>) {
        this._latest = input
    }

    async refreshAllFlightData() {
        const latestFlightData = await getLatestFlightData()
        this.latest = Promise.resolve(latestFlightData)
    }
}

const getLatestFlightData = async (): Promise<FlightData> => ({
    ARN: await getTwoDayFlightData("ARN"),
    GOT: await getTwoDayFlightData("GOT"),
    BMA: await getTwoDayFlightData("BMA"),
    MMX: await getTwoDayFlightData("MMX"),
    LLA: await getTwoDayFlightData("LLA"),
    UME: await getTwoDayFlightData("UME"),
    OSD: await getTwoDayFlightData("OSD"),
    VBY: await getTwoDayFlightData("VBY"),
    RNB: await getTwoDayFlightData("RNB"),
    KRN: await getTwoDayFlightData("KRN"),
})

const getTwoDayFlightData = async (
    airportIATA: string
): Promise<AirportFlights> => {
    logger.info(
        { airportIATA },
        `Fetching flight data for ${airportIATA} from Swedavia`
    )

    const [
        arrivalsToday,
        arrivalsTomorrow,
        departuresToday,
        departuresTomorrow,
    ] = await Promise.all([
        fetchFlights(airportIATA, "arrivals", dateTodayYYYYMMDD()),
        fetchFlights(airportIATA, "arrivals", dateTomorrowYYYYMMDD()),
        fetchFlights(airportIATA, "departures", dateTodayYYYYMMDD()),
        fetchFlights(airportIATA, "departures", dateTomorrowYYYYMMDD()),
    ])

    return {
        arrivals: [
            ...mapSwedaviaResponeToFlights(arrivalsToday),
            ...mapSwedaviaResponeToFlights(arrivalsTomorrow),
        ],
        departures: [
            ...mapSwedaviaResponeToFlights(departuresToday),
            ...mapSwedaviaResponeToFlights(departuresTomorrow),
        ],
    }
}

const dateTodayYYYYMMDD = () => new Date().toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().substring(0, 10)
}

const mapSwedaviaResponeToFlights = (
    swedaviaResponse: SwedaviaResponse
): Flight[] =>
    "to" in swedaviaResponse
        ? swedaviaResponse.flights.map((flight) => ({
            timestamp: flight.arrivalTime.scheduledUtc,
            airport: flight.departureAirportSwedish,
            flightNumber: flight.flightId,
            remarks: flight.remarksSwedish[0]?.text,
        }))
        : swedaviaResponse.flights.map((flight) => ({
            timestamp: flight.departureTime.scheduledUtc,
            airport: flight.arrivalAirportSwedish,
            flightNumber: flight.flightId,
            remarks: flight.remarksSwedish[0]?.text,
        }))
