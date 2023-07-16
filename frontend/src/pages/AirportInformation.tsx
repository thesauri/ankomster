import { Flights } from "../components/Flights.js"
import styles from "./AirportInformation.module.css"
import { Link } from "react-router-dom"
import { useFlightData } from "../hooks/useFlightData.js"
import { useSelectedAirport } from "../hooks/useSelectedAirport.js"

export const AirportInformation = () => {
    const { airportIata, type } = useSelectedAirport()

    return (
        <article>
            <nav className={styles.nav}>
                {type === "arrivals" ? (
                    <h2 className={styles.inactiveNavItem}>Ankomster</h2>
                ) : (
                    <Link to={`/airports/${airportIata}/arrivals`} replace={true}>
                        <h2 className={styles.activeNavItem}>
                            Ankomster
                        </h2>
                    </Link>
                )}
                {type === "departures" ? (
                    <h2 className={styles.inactiveNavItem}>Avgångar</h2>
                ) : (
                    <Link to={`/airports/${airportIata}/departures`} replace={true}>
                        <h2 className={styles.activeNavItem}>
                            Avgångar
                        </h2>
                    </Link>
                )}
            </nav>
            <FlightsRow />
        </article>
    )
}

const FlightsRow = () => {
    const { airportIata, type } = useSelectedAirport()
    const flightData = useFlightData()

    if (flightData.isIdle || flightData.isLoading) {
        return <p>Hämtar flyg...</p>
    }

    const flights = flightData.isSuccess && flightData.data[airportIata]?.[type]

    if (flightData.isError || !flights) {
        return <p>Kunde inte hämta flyg</p>
    }

    return (
        <Flights
            type={type}
            flights={flights}
        />
    )
}