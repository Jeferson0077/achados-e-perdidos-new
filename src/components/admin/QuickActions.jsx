import {
    FiPlusCircle,
    FiPackage,
    FiGift,
    FiArchive,
} from "react-icons/fi"

import { Link } from "react-router-dom"

function QuickActions() {
    const actions = [
        {
            title: "Novo Item",
            icon: <FiPlusCircle />,
            path: "/admin/new-item",
            variant: "new",
        },
        {
            title: "Consultar ativos",
            icon: <FiPackage />,
            path: "/admin/itens-ativos",
            variant: "active",
        },
        {
            title: "Itens para doação",
            icon: <FiGift />,
            path: "/admin/doacoes",
            variant: "donation",
        },
        {
            title: "Histórico de doações",
            icon: <FiArchive />,
            path: "/admin/itens-doados",
            variant: "history",
        },
    ]

    return (
        <section className="dashboard-panel dashboard-panel--actions">

            <div className="dashboard-panel__header">
                <div>
                    <span className="dashboard-panel__eyebrow">
                        Navegação
                    </span>

                    <h2 className="dashboard-panel__title">
                        Ações rápidas
                    </h2>
                </div>
            </div>

            <div className="quick-actions">

                {actions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.path}
                        className={`quick-action quick-action--${action.variant}`}
                    >

                        <span className="quick-action__icon">
                            {action.icon}
                        </span>

                        <span className="quick-action__title">
                            {action.title}
                        </span>

                    </Link>
                ))}

            </div>

        </section>
    )
}

export default QuickActions