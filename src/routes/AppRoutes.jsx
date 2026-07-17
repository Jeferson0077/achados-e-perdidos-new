import { BrowserRouter, Route, Routes } from "react-router-dom"

import Home from "../pages/Home"
import NotFound from "../pages/NotFound"

import Dashboard from "../pages/admin/Dashboard"
import Login from "../pages/admin/Login"
import NewItem from "../pages/admin/NewItem"
import ActiveItems from "../pages/admin/ActiveItems"
import WithdrawnItems from "../pages/admin/WithdrawnItems"
import Donations from "../pages/admin/Donations"

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/novo-item" element={<NewItem />} />
                <Route path="/admin/itens-ativos" element={<ActiveItems />} />
                <Route path="/admin/retirados" element={<WithdrawnItems />} />
                <Route path="/admin/doacoes" element={<Donations />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes