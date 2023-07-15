import { Router } from "express"
import { FlightData } from "../services/flightData"

export const apiRouter = (flightData: FlightData) => {
    const router = Router()

    router.get("/flights/all", async (request, response) => {
        const currentFlightDataCache = await flightData.latest
        response.json(currentFlightDataCache)
    })

    return router
}
