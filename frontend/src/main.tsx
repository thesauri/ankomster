import { render } from "preact"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./main.css"
import { AirportPicker } from "./pages/AirportPicker.js"
import { Page } from "./components/Page.js"
import { AirportInformation } from "./pages/AirportInformation.js"
import { prefetchFlightData } from "./hooks/useFlightData.js"

const queryClient = new QueryClient()

render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page />}>
                    <Route index element={<AirportPicker />} />
                    <Route path="airports/:airportIata/:type" element={<AirportInformation />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>,
    document.getElementById("app") as HTMLElement
)

prefetchFlightData(queryClient)