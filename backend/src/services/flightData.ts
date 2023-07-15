import { logger } from "../utils/logger.js"
import { fetchFlights } from "../utils/swedavia.js"

export class FlightData {
    private _latest: Promise<Record<string, unknown>> = getLatestFlightData()

    constructor() {}

    get latest(): Promise<Record<string, unknown>> {
        return this._latest
    }

    set latest(input: Promise<Record<string, unknown>>) {
        this._latest = input
    }

    async refreshAllFlightData() {
        const latestFlightData = await getLatestFlightData()
        this.latest = Promise.resolve(latestFlightData)
    }
}

const getLatestFlightData = async () => {
    const newFlightData: Record<string, unknown> = {}

    for (const airportIata of swedaviaAirports) {
        newFlightData[airportIata] = await fetchTwoDayFlightData(airportIata)
    }

    return newFlightData
}

const fetchTwoDayFlightData = async (airportIATA: string) => {
    logger.info({ airportIATA }, `Fetching flight data for ${airportIATA} from Swedavia`)
    const arrivalsToday = fetchFlights(airportIATA, "arrivals", dateTodayYYYYMMDD())
    const arrivalsTomorrow = fetchFlights(airportIATA, "arrivals", dateTomorrowYYYYMMDD())
    const departuresToday = fetchFlights(airportIATA, "departures", dateTodayYYYYMMDD())
    const departuresTomorrow = fetchFlights(airportIATA, "departures", dateTomorrowYYYYMMDD())
    const arrivalsAndDepartures = await Promise.all([
        arrivalsToday,
        arrivalsTomorrow,
        departuresToday,
        departuresTomorrow
    ])
    const flights = {
        arrivals: [arrivalsAndDepartures[0], arrivalsAndDepartures[1]],
        departures: [arrivalsAndDepartures[2], arrivalsAndDepartures[3]]
    }

    return flights
}

const dateTodayYYYYMMDD = () => (new Date()).toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().substring(0, 10)
}

const swedaviaAirports = ["ARN", "GOT", "BMA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"]
