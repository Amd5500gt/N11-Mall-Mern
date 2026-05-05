import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import { SearchProvider } from "./SearchContext"

const Layout = ({ cartCount }) => {
  return (
    <div className="app">
      <Header cartCount={cartCount}  />
      <ScrollToTop />
  
    <Outlet />
 
  
      <Footer />

    </div>
  )
}

export default Layout