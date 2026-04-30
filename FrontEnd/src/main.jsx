
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import  { Cart } from './RootPage.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter >
    <Cart>
        <App />
    </Cart>
    </BrowserRouter>
 
)
