import got from "got"
import { logger } from "./logger.js"
import { env } from "./env.js"
import { SwedaviaResponse, SwedaviaResponseSchema } from "./swedavia.interface.js"

export const fetchFlights = async (airportIATA: string, mode: "arrivals" | "departures", dateYYYYMMDD: string): Promise<SwedaviaResponse> => {
    logger.debug({ airportIATA, mode, dateYYYYMMDD }, `Fetching ${mode} for ${airportIATA} on ${dateYYYYMMDD} from Swedavia`)

    const response = await swedaviaGot.get(`${env.SWEDAVIA_BASE_URL}flightinfo/v2/${airportIATA}/${mode}/${dateYYYYMMDD}`).json()
    return SwedaviaResponseSchema.parse(response)
}

const swedaviaGot = got.extend({
    headers: {
        "Accept": "application/json",
        "Cache-Control": "nocache",
        "Ocp-Apim-Subscription-Key": env.SWEDAVIA_API_KEY
    }
})