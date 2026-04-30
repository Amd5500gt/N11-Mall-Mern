import Header from "./components/Header"
import Footer from "./components/Footer"
import { Outlet } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"

const Layout = ({ cartCount,FindItems }) => {
  return (
    <div className="app">
      <Header cartCount={cartCount} FindItems={FindItems} />
      <ScrollToTop />
  
    <Outlet />
 
  
      <Footer />
    </div>
  )
}

export default Layout