import ky from "ky"
import { useQuery, QueryClient } from "react-query"
import { FlightsResponse, FlightsResponseSchema } from "@ankomster/backend/src/controllers/flightsRouter.interface"

export const useFlightData = () => useQuery(FLIGHT_DATA_KEY, fetchFlightData)

export const prefetchFlightData = async (queryClient: QueryClient) => {
    queryClient.prefetchQuery(FLIGHT_DATA_KEY, fetchFlightData)
}

const fetchFlightData = async (): Promise<FlightsResponse> => {
    const potentialFlightData = await backendKy.get("/api/v1/flights").json()
    return FlightsResponseSchema.parse(potentialFlightData)
}

export type FlightData = FlightsResponse
export const FlightDataSchema = FlightsResponseSchema

const FLIGHT_DATA_KEY = "flightData"

const backendKy = ky.create({
    headers: {
        "session-id": crypto.randomUUID()
    },
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set("request-id", crypto.randomUUID())
            }
        ]
    }
})
