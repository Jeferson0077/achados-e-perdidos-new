import { NavLink } from "react-router-dom"

function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <h1 className="admin-sidebar__logo">
                ACHADOS
                <br />
                E
                <br />
                PERDIDOS
            </h1>

            <nav className="admin-sidebar__nav">
                <NavLink to="/admin/dashboard">
                    <span>▦</span>
                    Dashboard
                </NavLink>

                <NavLink to="/admin/new-item">
                    <span>＋</span>
                    Novo item
                </NavLink>

                <NavLink to="/admin/itens-ativos">
                    <span>□</span>
                    Itens Ativos
                </NavLink>

                <NavLink to="/admin/itens-retirados">
                    <span>✓</span>
                    Retirados
                </NavLink>

                <NavLink to="/admin/doacoes">
                    <span>♡</span>
                    Doações
                </NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar