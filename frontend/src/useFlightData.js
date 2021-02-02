import { useState, useEffect } from "react"

const useFlightData = (airportIATA) => {
    const [flightData, setFlightData] = useState(null)
    const [fetchError, setFetchError] = useState(null)

    useEffect(() => {
        const fetchFlightData = async () => {
            try {
              const flightDataString = (await fetch(`/api/${airportIATA}`))
              const flightData = await flightDataString.json()
              setFlightData(flightData)
            } catch (error) {
              console.error("Unable to fetch flight data: ", error)
              setFetchError("Flygtiderna kunde tyvärr inte hämtas, prova igen senare.")
            }
        }
        fetchFlightData()
    }, [airportIATA])

    return [flightData, fetchError];
}

export default useFlightData
