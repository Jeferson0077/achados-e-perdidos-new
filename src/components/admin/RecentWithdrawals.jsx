import {
    FiCheckCircle,
    FiPackage,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"

function RecentWithdrawals() {
    const { items } = useItems()

    const recentWithdrawals = [...items]
        .filter(
            (item) =>
                item.status === ITEM_STATUS.RETIRADO &&
                item.dataRetirada
        )
        .sort(
            (firstItem, secondItem) =>
                new Date(secondItem.dataRetirada) -
                new Date(firstItem.dataRetirada)
        )
        .slice(0, 5)

    function formatDate(date) {
        return new Intl.DateTimeFormat("pt-BR").format(
            new Date(date)
        )
    }

    return (
        <section className="dashboard-panel">
            <div className="dashboard-panel__header">
                <div>
                    <span className="dashboard-panel__eyebrow">
                        Entregas recentes
                    </span>

                    <h2 className="dashboard-panel__title">
                        Últimas retiradas
                    </h2>
                </div>

                <span className="dashboard-panel__icon dashboard-panel__icon--withdrawn">
                    <FiCheckCircle />
                </span>
            </div>

            {recentWithdrawals.length > 0 ? (
                <div className="recent-items">
                    {recentWithdrawals.map((item) => (
                        <article
                            className="recent-item"
                            key={item.id}
                        >
                            <div className="recent-item__image">
                                {item.foto ? (
                                    <img
                                        src={item.foto}
                                        alt={item.nome}
                                    />
                                ) : (
                                    <FiPackage />
                                )}
                            </div>

                            <div className="recent-item__content">
                                <strong className="recent-item__name">
                                    {item.nome}
                                </strong>

                                <span className="recent-item__category">
                                    {item.retiradoPor
                                        ? `Retirado por ${item.retiradoPor}`
                                        : "Responsável não informado"}
                                </span>
                            </div>

                            <div className="recent-item__details">
                                <strong>{item.codigo}</strong>

                                <span>
                                    {formatDate(
                                        item.dataRetirada
                                    )}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="dashboard-panel__empty">
                    <FiCheckCircle />

                    <p>Nenhum item retirado.</p>
                </div>
            )}
        </section>
    )
}

export default RecentWithdrawals