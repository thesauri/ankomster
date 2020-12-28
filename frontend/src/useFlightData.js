import { useState, useEffect } from "react"

const useFlightData = () => {
    const [flightData, setFlightData] = useState(null)

    useEffect(() => {
        const fetchFlightData = async () => {
            const flightData = await (await fetch("http://localhost:8080/ARN")).json()
            setFlightData(flightData)
        }
        fetchFlightData()
    }, [])

    return flightData;
}

export default useFlightData
