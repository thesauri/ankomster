import ky from "ky"
import { useQuery, QueryClient } from "react-query"
import { z } from "zod"

export const useFlightData = () => useQuery(FLIGHT_DATA_KEY, fetchFlightData)

export const prefetchFlightData = async (queryClient: QueryClient) => {
  queryClient.prefetchQuery(FLIGHT_DATA_KEY, fetchFlightData)
}

const fetchFlightData = async () => {
  const potentialFlightData = await backendKy.get("/api/v1/flights/all").json()
  return FlightDataSchema.parse(potentialFlightData)
}

const FLIGHT_DATA_KEY = "flightData"

const BaseFlightSchema = z.object({
  flightId: z.string(),
  locationAndStatus: z.object({
    flightLegStatus: z.string(),
  }),
  remarksSwedish: z.array(
    z.object({
      text: z.string()
    })
  ),
});

const ArrivingFlightSchema = BaseFlightSchema.extend({
  departureAirportSwedish: z.string(),
  departureAirportEnglish: z.string(),
  arrivalTime: z.object({
    scheduledUtc: z.string()
  }),
})

const DepartingFlightSchema = BaseFlightSchema.extend({
  arrivalAirportEnglish: z.string(),
  arrivalAirportSwedish: z.string(),
  departureTime: z.object({
    scheduledUtc: z.string()
  }),
})

const FlightSchema = z.union([ArrivingFlightSchema, DepartingFlightSchema]);

export type Flight = z.infer<typeof FlightSchema>

const AirportSchema = z.object({
  arrivals: z.array(
    z.object({
      to: z.object({
        flightArrivalDate: z.string()
      }),
      flights: z.array(ArrivingFlightSchema)
    })
  ),
  departures: z.array(
    z.object({
      from: z.object({
        flightDepartureDate: z.string()
      }),
      flights: z.array(DepartingFlightSchema)
    })
  )
})

export const SupportedAirportsSchema = z.union([
  z.literal("ARN"),
  z.literal("GOT"),
  z.literal("BMA"),
  z.literal("MMX"),
  z.literal("LLA"),
  z.literal("UME"),
  z.literal("OSD"),
  z.literal("VBY"),
  z.literal("RNB"),
  z.literal("KRN"),
]);

export type SupportedAirports = z.infer<typeof SupportedAirportsSchema>

const FlightDataSchema = z.record(SupportedAirportsSchema, AirportSchema);

const backendKy = ky.create({
  headers: {
    "ankomster-session-id": crypto.randomUUID()
  },
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set("ankomster-request-id", crypto.randomUUID())
      }
    ]
  }
})
