import { z } from "zod"
import { FlightDataSchema } from "../services/flightDataCache.interface"

export const FlightsResponseSchema = FlightDataSchema
export type FlightsResponse = z.infer<typeof FlightsResponseSchema>