import { Link } from "react-router-dom"
import "./AirportPicker.css"
import Page from "./Page"

const AirportPicker = () => (
  <Page>
    <div className="airport-picker">
      <h1>Flyginfo <span>/ Välj flygplats</span></h1>
      <h2>
        <Link to="/ARN/arrivals">
          Stockholm Arlanda
        </Link>
      </h2>
      <h2>
        <Link to="/GOT/arrivals">
          Göteborg Landvetter
        </Link>
      </h2>
      <h2>
        <Link to="/BMA/arrivals">
          Stockholm Bromma
        </Link>
      </h2>
      <h2>
        <Link to="/MMX/arrivals">
          Malmö
        </Link>
      </h2>
      <h2>
        <Link to="/LLA/arrivals">
          Luleå
        </Link>
      </h2>
      <h2>
        <Link to="/UME/arrivals">
          Umeå
        </Link>
      </h2>
      <h2>
        <Link to="/OSD/arrivals">
          Åre Östersund
        </Link>
      </h2>
      <h2>
        <Link to="/VBY/arrivals">
          Visby
        </Link>
      </h2>
      <h2>
        <Link to="/RNB/arrivals">
          Ronneby
        </Link>
      </h2>
      <h2>
        <Link to="/KRN/arrivals">
          Kiruna
        </Link>
      </h2>
    </div>
  </Page>
)

export default AirportPicker
