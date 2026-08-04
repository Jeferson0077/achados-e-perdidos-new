import { NavLink } from "react-router-dom"

import { FiBarChart2 } from "react-icons/fi"

import {
    FiGrid,
    FiPlusCircle,
    FiPackage,
    FiCheckCircle,
    FiGift,
    FiArchive
} from "react-icons/fi"

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
                    <FiGrid size={18} />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/new-item"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <FiPlusCircle size={18} />
                    Novo Item
                </NavLink>

                <NavLink
                    to="/admin/itens-ativos"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <FiPackage size={18} />
                    Itens Ativos
                </NavLink>

                <NavLink
                    to="/admin/itens-retirados"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <FiCheckCircle size={18} />
                    Itens Retirados
                </NavLink>

                <NavLink
                    to="/admin/doacoes"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <FiGift size={18} />
                    Itens para Doação
                </NavLink>

                <NavLink
                    to="/admin/itens-doados"
                    className={({ isActive }) =>
                        `admin-sidebar__link ${isActive ? "active" : ""}`
                    }
                >
                    <FiArchive size={18} />
                    Histórico de Doações
                </NavLink>
            </nav>

            <NavLink
                to="/admin/relatorios"
                className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? "active" : ""
                    }`
                }
            >
                <FiBarChart2 />
                Relatórios
            </NavLink>

        </aside>
    )
}

export default AdminSidebar