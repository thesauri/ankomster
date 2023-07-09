import { Link } from "react-router-dom"
import "./AirportPicker.css"
import { getAirportName } from "../utils/airportNames"

export const AirportPicker = () => (
  <div className="airport-picker">
    <h2>
      <Link to="/airports/ARN/arrivals">
        {getAirportName("ARN")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/GOT/arrivals">
        {getAirportName("GOT")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/BMA/arrivals">
        {getAirportName("BMA")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/MMX/arrivals">
        {getAirportName("MMX")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/LLA/arrivals">
        {getAirportName("LLA")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/UME/arrivals">
        {getAirportName("UME")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/OSD/arrivals">
        {getAirportName("OSD")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/VBY/arrivals">
        {getAirportName("VBY")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/RNB/arrivals">
        {getAirportName("RNB")}
      </Link>
    </h2>
    <h2>
      <Link to="/airports/KRN/arrivals">
        {getAirportName("KRN")}
      </Link>
    </h2>
  </div>
)
