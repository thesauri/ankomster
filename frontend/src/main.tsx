import { render } from 'preact'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AirportPicker } from './AirportPicker'
import { Page } from './Page'
import { App } from './App'
import { prefetchFlightData } from './useFlightData'
import "./main.css"

const queryClient = new QueryClient()

render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page />}>
                    <Route index element={<AirportPicker />} />
                    <Route path=":airportIata/arrivals" element={<App mode="arrivals" />} />
                    <Route path=":airportIata/departures" element={<App mode="departures" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>,
    document.getElementById("app") as HTMLElement
)

prefetchFlightData(queryClient)