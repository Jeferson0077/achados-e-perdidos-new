import { useNavigate } from "react-router-dom"
import { FiLogOut } from "react-icons/fi"

import { useAuth } from "../../contexts/AuthContext"

function AdminHeader() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()

        navigate("/login", {
            replace: true,
        })
    }

    return (
        <header className="admin-header">
            <div className="admin-header__left">
                <h1>
                    Painel Administrativo
                </h1>

                <p>
                    Sistema de Achados e Perdidos
                </p>
            </div>

            <div className="admin-header__right">

                <span className="admin-header__user">
                    {user?.nome}
                </span>

                <button
                    className="admin-header__logout"
                    onClick={handleLogout}
                >
                    <FiLogOut />
                    Sair
                </button>

            </div>
        </header>
    )
}

export default AdminHeader