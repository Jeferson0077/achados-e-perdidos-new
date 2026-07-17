import { NavLink } from "react-router-dom"

function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__logo">
                ACHADOS E PERDIDOS
            </div>

            <nav className="admin-sidebar__nav">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar__link admin-sidebar__link--active"
                            : "admin-sidebar__link"
                    }
                >
                    <span className="admin-sidebar__icon">▦</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/novo-item"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar__link admin-sidebar__link--active"
                            : "admin-sidebar__link"
                    }
                >
                    <span className="admin-sidebar__icon">＋</span>
                    <span>Novo Item</span>
                </NavLink>

                <NavLink
                    to="/admin/itens-ativos"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar__link admin-sidebar__link--active"
                            : "admin-sidebar__link"
                    }
                >
                    <span className="admin-sidebar__icon">□</span>
                    <span>Itens Ativos</span>
                </NavLink>

                <NavLink
                    to="/admin/retirados"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar__link admin-sidebar__link--active"
                            : "admin-sidebar__link"
                    }
                >
                    <span className="admin-sidebar__icon">✓</span>
                    <span>Retirados</span>
                </NavLink>

                <NavLink
                    to="/admin/doacoes"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar__link admin-sidebar__link--active"
                            : "admin-sidebar__link"
                    }
                >
                    <span className="admin-sidebar__icon">♡</span>
                    <span>Doações</span>
                </NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar