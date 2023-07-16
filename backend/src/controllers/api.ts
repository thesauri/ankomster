import { Router } from "express"
import { FlightDataCache } from "../services/flightDataCache.js"
import { flightsRouter } from "./flightsRouter.js"

export const apiRouter = (flightDataCache: FlightDataCache) => {
    const initializedFlightsRouter = flightsRouter(flightDataCache)

    const router = Router()

    router.use("/flights", initializedFlightsRouter)

    return router
}
