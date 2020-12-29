import { useState, useEffect } from "react"

const useFlightData = (airportIATA) => {
    const [flightData, setFlightData] = useState(null)

    useEffect(() => {
        const fetchFlightData = async () => {
            const flightData = await (await fetch(`/api/${airportIATA}`)).json()
            setFlightData(flightData)
        }
        fetchFlightData()
    }, [airportIATA])

    return flightData;
}

export default useFlightData
