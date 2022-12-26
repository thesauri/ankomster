import { useQuery } from "react-query"

export const useFlightData = () => useQuery(FLIGHT_DATA_KEY, fetchFlightData)

export const prefetchFlightData = async (queryClient) => {
  queryClient.prefetchQuery(FLIGHT_DATA_KEY, fetchFlightData)
}

const fetchFlightData = async () => {
  const flightDataString = (await fetch(`/api/flights/all`))
  return flightDataString.json()
}

const FLIGHT_DATA_KEY = "flightData"
