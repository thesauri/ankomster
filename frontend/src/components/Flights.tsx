import { Flight, SupportedAirports, useFlightData } from "../hooks/useFlightData"

export const Flights = ({ mode, airportIata }: { mode: Mode, airportIata: SupportedAirports }) => {
  const { isLoading, isSuccess, data: flightData } = useFlightData()

  if (!isSuccess) {
    const message = isLoading ? "Hämtar flyg..." : "Kunde inte hämta flyg"
    return (<DummyFlights mode={mode} message={message} />)
  }

  const flights = flightData[airportIata]?.[mode]
    .map(flightsOnDate => ({
      date: "to" in flightsOnDate ? flightsOnDate.to.flightArrivalDate : flightsOnDate.from.flightDepartureDate,
      flights: flightsOnDate.flights
        .map(flight => flight) // TODO: Remove this redudant map (it's here to make the type checker happy with the filter below)
        .filter((flight: Flight) => flight.locationAndStatus.flightLegStatus !== "DEL")
        .sort((flightA, flightB) => new Date(scheduledUtcOf(flightA)).getTime() - new Date(scheduledUtcOf(flightB)).getTime())
    }))

  const flightRows = flights?.flatMap((flightsOnDate, dateIndex) => {
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
        <DateRow key={flightsOnDate.date} date={new Date(flightsOnDate.date)} />
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

const scheduledUtcOf = (flight: Flight) => "arrivalTime" in flight ? flight.arrivalTime.scheduledUtc : flight.departureTime.scheduledUtc
const destinationOf = (flight: Flight) => "departureAirportSwedish" in flight ? flight.departureAirportSwedish : flight.arrivalAirportSwedish

const DummyFlights = ({ mode, message }: { mode: Mode, message: string}) => (
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

const FlightHeader = ({ mode }: { mode: Mode }) => (
  <thead>
    <tr>
      <th>Tid</th>
      <th>{mode === "arrivals" ? "Från" : "Till"}</th>
      <th>Flygnr</th>
      <th>Anmärkning</th>
    </tr>
  </thead>
)

const FlightRow = ({
    time,
    from,
    flightId,
    remarks
  }: {
    time: Date,
    from: string,
    flightId: string,
    remarks: string
}) => {
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

const DateRow = ({ date }: { date: Date }) => {
  return (
    <tr>
      <td colSpan={4}>{date.toDateString()}</td>
    </tr>
  )
}

type Mode = "arrivals" | "departures"