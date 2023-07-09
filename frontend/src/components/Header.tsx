import { Link, useParams } from "react-router-dom"
import styles from "./Header.module.css"
import { getAirportName } from "../utils/airportNames"

export const Header = () => {
    const { airportIata } = useParams()
    const airportName = airportIata && getAirportName(airportIata)

    return (
        <nav className={styles.headerRow}>
            {airportName ? (
                <>
                    <Link to="/" className={styles.headerLink}><h1>Flygplatser</h1></Link>
                    <h1 className={styles.headerInactive}>/</h1>
                    <h1 className={styles.headerInactive}>{airportName}</h1>
                </>
            ) : (
                <>
                    <h1 className={styles.headerInactive}>Flygplatser</h1>
                </>
            )}
        </nav>
    )
}
