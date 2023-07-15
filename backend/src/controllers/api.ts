import { Router } from "express"
import { FlightData } from "../services/flightData"

export const apiRouter = (flightData: FlightData) => {
    const router = Router()

    router.get("/flights", async (request, response) => {
        const currentFlightDataCache = await flightData.latest
        response.header("cache-control", "public, max-age=60")
        response.json(currentFlightDataCache)
    })

    return router
}
