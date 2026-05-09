import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'  // Change Cart to CartProvider
import { SearchProvider } from './context/SearchContext.jsx'  // Change Cartcontext to SearchProvider
import { GoogleOAuthProvider }
from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <GoogleOAuthProvider
  clientId="544841424268-ouptou7q8ca2j72gajck8ckrcr4btl7h.apps.googleusercontent.com"  >
      <SearchProvider>
            <CartProvider>  {/* Change Cart to CartProvider */}
                <App />
            </CartProvider>
        </SearchProvider>
        </GoogleOAuthProvider>
    </BrowserRouter>
)