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
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <span>▦</span>
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/new-item"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <span>＋</span>
                    Novo item
                </NavLink>

                <NavLink
                    to="/admin/itens-ativos"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <span>□</span>
                    Itens Ativos
                </NavLink>

                <NavLink
                    to="/admin/itens-retirados"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <span>✓</span>
                    Retirados
                </NavLink>

                <NavLink
                    to="/admin/doacoes"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <span>♡</span>
                    Doações
                </NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar