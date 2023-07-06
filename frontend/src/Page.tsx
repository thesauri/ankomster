import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"

export const Page = () => (
  <>
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
)
