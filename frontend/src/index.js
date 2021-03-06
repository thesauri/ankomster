import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import AirportPicker from "./AirportPicker"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/:airportIATA/arrivals">
          <App mode="arrivals" />
        </Route>
        <Route path="/:airportIATA/departures">
          <App mode="departures" />
        </Route>
        <Route path="/">
          <AirportPicker />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
