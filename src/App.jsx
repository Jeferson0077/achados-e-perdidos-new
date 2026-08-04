import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import NotFound from "./pages/NotFound"

import Login from "./pages/admin/Login"
import Dashboard from "./pages/admin/Dashboard"
import NewItem from "./pages/admin/NewItem"
import ActiveItems from "./pages/admin/ActiveItems"
import WithdrawnItems from "./pages/admin/WithdrawnItems"
import Donations from "./pages/admin/Donations"
import DonatedItems from "./pages/admin/DonatedItems"
import Reports from "./pages/admin/Reports"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/new-item"
        element={
          <ProtectedRoute>
            <NewItem />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/itens-ativos"
        element={
          <ProtectedRoute>
            <ActiveItems />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/itens-retirados"
        element={
          <ProtectedRoute>
            <WithdrawnItems />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/doacoes"
        element={
          <ProtectedRoute>
            <Donations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/itens-doados"
        element={
          <ProtectedRoute>
            <DonatedItems />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/relatorios"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App