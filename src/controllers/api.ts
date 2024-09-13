import { Router } from "express"
import { FlightDataCache } from "../services/flightDataCache.js"
import { flightsRouter } from "./flightsRouter.js"

export const apiRouter = (flightDataCache: FlightDataCache) => {
    const initializedFlightsRouter = flightsRouter(flightDataCache)

    const router = Router()

    router.use("/flights", initializedFlightsRouter)

    router.get("/health", (_, res) => {
        res.status(200).send("OK")
    })

    return router
}
