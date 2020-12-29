import { Link } from "react-router-dom"
import "./AirportPicker.css"

const AirportPicker = () => (
  <div className="airport-picker">
    <h1>Flyginfo <span>/ Välj flygplats</span></h1>
    <Link to="/ARN/arrivals">
      <h2>Stockholm Arlanda</h2>
    </Link>
    <Link to="/GOT/arrivals">
      <h2>Göteborg Landvetter</h2>
    </Link>
    <Link to="/BMA/arrivals">
      <h2>Stockholm Bromma</h2>
    </Link>
    <Link to="/MMX/arrivals">
      <h2>Malmö</h2>
    </Link>
    <Link to="/LLA/arrivals">
      <h2>Luleå</h2>
    </Link>
    <Link to="/UME/arrivals">
      <h2>Umeå</h2>
    </Link>
    <Link to="/OSD/arrivals">
      <h2>Åre Östersund</h2>
    </Link>
    <Link to="/VBY/arrivals">
      <h2>Visby</h2>
    </Link>
    <Link to="/RNB/arrivals">
      <h2>Ronneby</h2>
    </Link>
    <Link to="/KRN/arrivals">
      <h2>Kiruna</h2>
    </Link>
  </div>
)

export default AirportPicker
