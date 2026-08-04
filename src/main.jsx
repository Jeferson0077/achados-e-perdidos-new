import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"

import App from "./App"
import { AuthProvider } from "./contexts/AuthContext"
import { ItemsProvider } from "./contexts/ItemsContext"

import "./styles/global.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <ItemsProvider>
          <App />
        </ItemsProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
)