import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import NewItem from "./pages/admin/NewItem";
import ActiveItems from "./pages/admin/ActiveItems";
import WithdrawnItems from "./pages/admin/WithdrawnItems";
import Donations from "./pages/admin/Donations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/new-item" element={<NewItem />} />
      <Route path="/admin/itens-ativos" element={<ActiveItems />} />
      <Route path="/admin/itens-retirados" element={<WithdrawnItems />} />
      <Route path="/admin/doacoes" element={<Donations />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;