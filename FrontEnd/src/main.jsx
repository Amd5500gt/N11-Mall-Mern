import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './Context/CartContext'  // Change Cart to CartProvider
import { SearchProvider } from './Context/SearchContext'  // Change CartContext to SearchProvider

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <SearchProvider>
            <CartProvider>  {/* Change Cart to CartProvider */}
                <App />
            </CartProvider>
        </SearchProvider>
    </BrowserRouter>
)