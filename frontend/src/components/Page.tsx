import { Outlet } from "react-router-dom"
import { Footer } from "./Footer"
import { Header } from "./Header"
import styles from "./Page.module.css"

export const Page = () => (
  <div className={styles.page}>
    <Header />
    <main className={styles.content}>
      <Outlet />
    </main>
    <Footer />
  </div>
)
