import Header from "../components/common/Header"
import Footer from "../components/common/Footer"
import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ui/ScrollToTop"
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