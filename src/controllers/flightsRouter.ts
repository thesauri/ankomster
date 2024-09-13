import { Router } from "express"
import { FlightDataCache } from "../services/flightDataCache.js"

export const flightsRouter = (flightData: FlightDataCache) => {
    const router = Router()

    router.get("/", async (request, response) => {
        const latestFlightData = await flightData.latest
        response.header("cache-control", "public, max-age=60")
        response.json(latestFlightData)
    })

    return router
}