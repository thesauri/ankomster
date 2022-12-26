import { useFlightData } from "./useFlightData"

const Flights = ({ mode, airportIata }) => {
  const { isLoading, isError, data: flightData, error } = useFlightData()

  if (isLoading || isError) {
    const message = error || "Hämtar flyg..."
    return (<DummyFlights message={message} />)
  }

  const flights = flightData[airportIata][mode]
    .map(flightsOnDate => ({
      date: flightsOnDate[mode === "arrivals" ? "to" : "from"][mode === "arrivals" ? "flightArrivalDate" : "flightDepartureDate"],
      flights: flightsOnDate.flights
        .filter(flight => flight.locationAndStatus.flightLegStatus !== "DEL")
        .sort((flightA, flightB) => new Date(scheduledUtcOf(flightA)) - new Date(scheduledUtcOf(flightB)))
    }))

  const flightRows = flights.flatMap((flightsOnDate, dateIndex) => {
    const flightRowsOnDate = flightsOnDate.flights.map(flight => {
      const time = new Date(scheduledUtcOf(flight))
      const from = destinationOf(flight)
      const flightId = flight.flightId
      const remarks = flight.remarksSwedish.length > 0 ? flight.remarksSwedish[flight.remarksSwedish.length - 1].text : ""

      return (
        <FlightRow
          key={`${mode}-${time.toISOString()}-${flightId}`}
          time={time}
          from={from}
          flightId={flightId}
          remarks={remarks}
        />
      )
    })
    if (dateIndex !== 0) {
      const dateRow = (
        <DateRow key={flightsOnDate.date} date={flightsOnDate.date} />
      )
      return [dateRow, ...flightRowsOnDate]
    } else {
      return flightRowsOnDate
    }
  })
  return (
    <table>
      <FlightHeader mode={mode} />
      <tbody>
        {flightRows}
      </tbody>
    </table>
  );
}

const scheduledUtcOf = (flight) => flight.arrivalTime ? flight.arrivalTime.scheduledUtc : flight.departureTime.scheduledUtc
const destinationOf = (flight) => flight.departureAirportSwedish || flight.arrivalAirportSwedish

const DummyFlights = ({ mode, message }) => (
  <table>
    <FlightHeader mode={mode} />
    <tbody>
      <tr>
        <td>{message}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
)

const FlightHeader = ({ mode }) => (
  <thead>
    <tr>
      <th>Tid</th>
      <th>{mode === "arrivals" ? "Från" : "Till"}</th>
      <th>Flygnr</th>
      <th>Anmärkning</th>
    </tr>
  </thead>
)

const FlightRow = ({ time, from, flightId, remarks }) => {
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`
  return (
    <tr>
      <td>{formattedTime}</td>
      <td>{from}</td>
      <td>{flightId}</td>
      <td>{remarks}</td>
    </tr>
  )
}

const DateRow = ({ date }) => {
  return (
    <tr>
      <td colSpan={4}>{date}</td>
    </tr>
  )
}

export default Flights;
