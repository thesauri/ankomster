import assert from "assert"
import process from "process"
import got from "got"

const API_KEY = process.env.API_KEY
assert(API_KEY, "Missing Swedavia API key as API_KEY environment variable")

export let flightData: Record<string, unknown> = {}

export const refreshAllFlightData = async () => {
    console.log("Refreshing all flight data...")

    const newFlightData: Record<string, unknown> = {}

    for (const airportIata of swedaviaAirports) {
        newFlightData[airportIata] = await fetchFlightData(airportIata)
    }

    flightData = newFlightData

    console.log("Flight data refreshed!")
}

const fetchFlightData = async (airportIATA: string) => {
    console.log(`Fetching flight data for ${airportIATA} from Swedavia`)
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
    flightData[airportIATA] = {
        flights,
        lastUpdate: new Date()
    }

    return flights
}

const fetchFlights = async (airportIATA: string, mode: "arrivals" | "departures", dateYYYYMMDD: string): Promise<unknown> => {
    const response = await swedaviaGot.get(`https://api.swedavia.se/flightinfo/v2/${airportIATA}/${mode}/${dateYYYYMMDD}`)
    return JSON.parse(response.body)
}

const dateTodayYYYYMMDD = () => (new Date()).toISOString().substring(0, 10)
const dateTomorrowYYYYMMDD = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().substring(0, 10)
}

const swedaviaGot = got.extend({
    headers: {
        "Accept": "application/json",
        "Cache-Control": "nocache",
        "Ocp-Apim-Subscription-Key": API_KEY
    }
})

export const swedaviaAirports = ["ARN", "GOT", "BMA", "MMX", "LLA", "UME", "OSD", "VBY", "RNB", "KRN"]
